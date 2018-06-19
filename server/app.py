import flask
import ldap
import os
import yaml
import logdet

from flask import Flask, Response, session, request, redirect, jsonify
from flask_login import LoginManager, UserMixin, AnonymousUserMixin, login_user, login_required, current_user, confirm_login, logout_user
from werkzeug.utils import secure_filename


# anything in `./instance/config.py` overrides config in `./config.py`
app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config')
app.config.from_pyfile('config.py')


#### login settings ####
USERS = {}

class Anonymous(AnonymousUserMixin):
    name = 'Anonymous'


class User(UserMixin):
    def __init__(self, username, password, active=False):
        user_dn = 'cn={},ou=Users,o=adbe'.format(username)
        self.username = username
        self.id = user_dn
        self.splunk_ldapgroups = None
        self.active = False
        try:
            ldapgroups = ldap_search(username, password)
            print('user: {0} ldapgroups: {1}'.format(self.id, ldapgroups))
            splunk_ldapgroups = filter_splunk_ldapgroups(ldapgroups)
            print('user: {0} splunk_ldapgroups: {1}'.format(self.id, splunk_ldapgroups))
            if splunk_ldapgroups:
                self.splunk_ldapgroups = splunk_ldapgroups
            self.active = True
        except ldap.INVALID_CREDENTIALS:
            pass
        USERS[user_dn] = self

    def is_active(self):
        return self.active

    def is_anonymous(self):
        return False

login_manager = LoginManager()
login_manager.anonymous_user = Anonymous
login_manager.login_view = "login"
login_manager.login_message = "Please log in to access this page."
login_manager.refresh_view = "reauth"
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_dn):
    try:
        return USERS[user_dn]
    except KeyError:
        return None


#### Load up global splunk configs from pillar files
AUTHORIZE_CONF, AUTHENTICATION_CONF, DEPLOYMENT_CONF = {}, {}, {}
for pillar in os.listdir(app.config['PILLAR_DIR']):
    if pillar.endswith('.sls'):
        with open(os.path.join(app.config['PILLAR_DIR'], pillar)) as pillar_file:
            if 'authorize' in pillar:
                AUTHORIZE_CONF = yaml.load(pillar_file)
            elif 'authentication' in pillar:
                AUTHENTICATION_CONF = yaml.load(pillar_file)
            elif 'deployment' in pillar:
                DEPLOYMENT_CONF = yaml.load(pillar_file)
            else:
                pass


#### Helper functions ####
def ldap_search(username, password):
    conn = ldap.initialize(app.config['LDAP_SERVER'])
    user_dn = 'cn={},ou=Users,o=adbe'.format(username)
    search_filt = 'cn={}'.format(username)

    conn.bind_s(user_dn, password)
    attrs = conn.search_s(app.config['BASE_DN'], ldap.SCOPE_SUBTREE, search_filt)
    ldapgroups = attrs[0][1]['memberOf']
    # E.g. ldap returns like: [b'cn=splunk_cst_basic', b'cn=splunk_cst_admin']
    return ldapgroups


def filter_splunk_ldapgroups(ldapgroups):
    splunk_ldapgroups = []
    for grp in ldapgroups:
        cn = grp.decode('utf_8')
        cn = cn.split(',')[0]
        if cn.split('=')[1].startswith('splunk'):
            splunk_ldapgroups.append(cn.replace('cn=', ''))
    return splunk_ldapgroups


def get_splunk_roles(user):
    # The user object should have splunk_ldapgroups attr since logging in
    user.splunk_roles = []
    for group in user.splunk_ldapgroups:
        try:
            user.splunk_roles = [*user.splunk_roles,
                                 *AUTHENTICATION_CONF[group]['splunkRoles']]
        except KeyError as e:
            print('user: {0}, keyError in get_splunk_roles: {1}'.format(user.id, e))
    print('user: {0}, splunk roles: {1}'.format(user.id, user.splunk_roles))


def get_splunk_indexes(user):
    user.splunk_indexes = []
    if not hasattr(user, 'splunk_roles'):
        get_splunk_roles(user)
    for role in user.splunk_roles:
        try:
            user.splunk_indexes = [*user.splunk_indexes,
                                   *AUTHORIZE_CONF[role]['srchIndexesAllowed']]
        except KeyError as e:
            print('user: {0}, keyError in get_splunk_indexes: '
                  '{1}'.format(user.id, e))


def get_splunk_confs(user):
    user.splunk_confs = {}
    if not hasattr(user, 'splunk_indexes'):
        get_splunk_indexes(user)
    for index_name in user.splunk_indexes:
        try:
            user.splunk_confs.update({index_name:  DEPLOYMENT_CONF[index_name]})
        except KeyError as e:
            print('user: {0}, keyError in get_splunk_confs: {1}'.format(user.id, e))
    print('user: {0}  splunk_confs: {1}'.format(user.id, user.splunk_confs))


#### API endpoints ####
@app.route('/api/ldapgroups', methods=['GET'])
@login_required
def ldapgroups():
    if request.method == 'GET':
        response = jsonify(current_user.splunk_ldapgroups)
        response.status_code = 200
        return response


@app.route('/api/roles', methods=['GET'])
@login_required
def roles():
    if request.method == 'GET':
        if not hasattr(current_user, 'splunk_roles'):
            get_splunk_roles(current_user)
        response = jsonify(current_user.splunk_roles)
        response.status_code = 200
        return response


@app.route('/api/indexes', methods=['GET'])
@login_required
def indexes():
    if request.method == 'GET':
        if not hasattr(current_user, 'splunk_indexes'):
            get_splunk_indexes(current_user)
        response = jsonify(current_user.splunk_indexes)
        response.status_code = 200
        return response


@app.route('/api/confs', methods=['GET', 'POST'])
@login_required
def inputs():
    if request.method == 'GET':
        if not hasattr(current_user, 'splunk_confs'):
            get_splunk_confs(current_user)
        response = jsonify(current_user.splunk_confs)
        response.status_code = 200
        return response
    if request.method == 'POST':
        update_conf = request.get_json()
        for index in update_conf.keys():
            if index in current_user.splunk_indexes:
                if 'inputs_conf' in update_conf[index].keys():
                    DEPLOYMENT_CONF[index]['inputs_conf'] = update_conf[index]['inputs_conf']
                if 'deploymentclient_conf' in update_conf[index].keys():
                    DEPLOYMENT_CONF[index]['deploymentclient_conf'] = update_conf[index]['deploymentclient_conf']
        get_splunk_confs(current_user)
        response = jsonify(current_user.splunk_confs)
        response.status_code = 200
        return response


@app.route('/api/logvalidation', methods=['POST'])
@login_required
def run_logdet():
    if request.method == 'POST':
        _file = request.files['file']
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], _file.filename)
        _file.save(save_path)
        with open(save_path, 'r') as logfile:
            result = logdet.detect(logfile)
        os.remove(save_path)
        response = jsonify(result)
        response.status_code = 200
        return response


#### ROUTES ####
@app.route('/')
@login_required
def index():
    return 'Hello world'


@app.route('/checksession', methods=['GET'])
def checksession():
    if request.method == 'GET':
        try:
            response = jsonify({'username': current_user.username})
            response.status_code = 200
        except KeyError:
            response = jsonify({'message': 'Unauthorized'})
            response.status_code = 401
        return response


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        ldap_username = request.json['username']
        ldap_password = request.json['password']

        user = User(ldap_username, ldap_password)
        if not user.active:
            response = jsonify({'message': 'Invalid LDAP Credentials'})
            response.status_code = 401
            return response
        login_user(user)
        response = jsonify({'message': 'Login Successful',
                            '_id': user.id,
                            'username': ldap_username})
        response.status_code = 200
        return response


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(flask.url_for('index'))


if __name__ == '__main__':
    app.run()
