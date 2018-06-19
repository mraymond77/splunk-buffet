acme_prod:
  indexes_conf:
    frozenTimePeriodInSecs: 7776000
  inputs_conf:
  - type: monitor
    path: /var/log/acme_prod/app.log
    sourcetype: json:acme_prod
  - type: monitor
    path: /var/log/acme_prod/error.log
    sourcetype: apache_error
  deploymentclient_conf:
  - or1

acme_stage:
  indexes_conf:
    frozenTimePeriodInSecs: 2592000
  inputs_conf:
  - type: monitor
    path: /var/log/acme_stage/access.log
    sourcetype: access_combined
  - type: monitor
    path: /var/log/acme_stage/error.log
    sourcetype: apache_error
  deploymentclient_conf:
  - wa1
  - sin2
  - da2
  - va5
 
acme_dev:
  indexes_conf:
    frozenTimePeriodInSecs: 604800
  inputs_conf:
  - type: monitor
    path: /var/log/acme_dev/error.json
    sourcetype: json:acme
  deploymentclient_conf:
  - wa1
  - sin2
  - va5
