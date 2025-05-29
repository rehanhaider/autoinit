#!/bin/bash

# --- Copy the files ---
SILENT_MODE=$ORIGINAL_SILENT_MODE
PROMPT "copy the files" "cp -r ${MODULES_DIR}/mobile ${TARGET_DIR}/mobile"


# --- Install the requirements ---
init_cdk_project() {
    cd ${TARGET_DIR}/mobile
    RUN "Configuring npm project..." "source ${SCRIPT_DIR}/mobile/npm-config.sh"
    cd ${TARGET_DIR}
}

PROMPT "cdk project initialization" "init_cdk_project"
