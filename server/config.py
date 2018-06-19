import os


LDAP_SERVER = ''
BASE_DN = ''
PILLAR_DIR = '{}/testconfigs/pillar'.format(os.path.dirname(os.path.realpath(__file__)))
UPLOAD_FOLDER = '/tmp'
MAX_CONTENT_LENGTH = 16 * 1024 * 1024
