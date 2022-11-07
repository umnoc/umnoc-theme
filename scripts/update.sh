#!/bin/bash

sudo -H -u edxapp bash << EOF
source /edx/app/edxapp/edxapp_env
cd ~

cd themes/umnoc-theme/
git pull
cd ~

paver update_assets lms --settings=production
python manage.py lms --settings=production collectstatic --noinput
EOF

sudo /edx/bin/supervisorctl restart lms