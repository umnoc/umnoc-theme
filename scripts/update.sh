sudo su edxapp -s /bin/bash
source /edx/app/edxapp/edxapp_env
cd ~

cd themes/umnoc-theme/ && git pull
cd ~ && paver update_assets lms --settings=production --themes umnoc-theme && python manage.py lms --settings=production collectstatic --noinput
