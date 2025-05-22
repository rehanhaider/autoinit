#!/bin/bash

# --- Copy the files ---
SILENT_MODE=$ORIGINAL_SILENT_MODE
PROMPT "copy the files" "cp -r ${CONFIG_DIR}/web ${TARGET_DIR}/web"

# --- Install the requirements ---
init_web_project() {
    cd ${TARGET_DIR}/web
    RUN "Configuring npm project..." "source ${SCRIPT_DIR}/web/npm-config.sh"
    cd ${TARGET_DIR}
}

PROMPT "web project initialization" "init_web_project"