#!/bin/bash

# --- Copy the files ---
SILENT_MODE=$ORIGINAL_SILENT_MODE
PROMPT "copy the files" "cp -r ${CONFIG_DIR}/aws ${ROOT_DIR}/aws"


# --- Install the requirements ---
init_cdk_project() {
    cd ${ROOT_DIR}/aws
    RUN "Initializing npm project..." "npm init -y"
    RUN "Setting project name..." "npm pkg set name=aws version=0.1.0"
    RUN "Deleting description, main, keywords, author, license, type..." "npm pkg delete description main keywords author license type"
    RUN "Setting scripts..." "npm pkg set scripts.build="tsc" scripts.test="jest" scripts.watch="tsc -w" scripts.cdk="cdk""
    RUN "Installing dependencies..." "npm install --save aws-cdk-lib constructs"
    RUN "Installing dev dependencies..." "npm install --save-dev typescript @types/node @types/jest jest ts-node ts-jest aws-cdk"
    cd ${ROOT_DIR}
}

PROMPT "cdk project initialization" "init_cdk_project"


