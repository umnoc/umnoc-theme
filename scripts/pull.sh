#!/bin/bash

sudo -H -u edxapp bash << EOF
source /edx/app/edxapp/edxapp_env
cd ~/edx-platform/

cd themes/umnoc-theme/
git pull
EOF