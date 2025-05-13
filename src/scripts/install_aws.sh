#!/bin/bash

# --- Copy the files ---
SILENT_MODE=$ORIGINAL_SILENT_MODE
PROMPT "copy the files" "cp -r ${CONFIG_DIR}/aws ${ROOT_DIR}/aws"


# --- Install the requirements ---
init_cdk_project() {
    cd ${ROOT_DIR}/aws
    source ${SCRIPT_DIR}/aws/npm-config.sh
    cd ${ROOT_DIR}
}

PROMPT "cdk project initialization" "init_cdk_project"


