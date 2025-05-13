#!/bin/bash

# --- Copy the files ---
SILENT_MODE=$ORIGINAL_SILENT_MODE
PROMPT "copy the files" "cp -r ${CONFIG_DIR}/aws ${TARGET_DIR}/aws"


# --- Install the requirements ---
init_cdk_project() {
    cd ${TARGET_DIR}/aws
    RUN "Configuring npm project..." "source ${SCRIPT_DIR}/aws/npm-config.sh"
    cd ${TARGET_DIR}
}

PROMPT "cdk project initialization" "init_cdk_project"


