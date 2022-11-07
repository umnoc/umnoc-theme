#!/bin/bash

sudo -H -u edxapp bash << EOF
source /edx/app/edxapp/edxapp_env
cd ~/edx-platform/

cd themes/umnoc-theme/
git pull
cd ~/edx-platform/

paver update_assets lms --settings=production
python manage.py lms --settings=production collectstatic --noinput
EOF

sudo /edx/bin/supervisorctl restart lms