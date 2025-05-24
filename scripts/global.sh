#!/bin/bash

GLOBAL_ERROR=false

# --- Global config files ---

config_files=(
    ".gitignore"
    ".prettierrc"
    "config.json"
    "Makefile"
    "mise.toml"
    "requirements.txt"
    "ruff.toml"
)

# --- Global config folders ---

config_folders=(
    ".scripts"
    ".vscode"
)

copy_config_folder() {
    for folder in "${config_folders[@]}"; do
        # Check if the folder exists in the CURRENT_DIR
        if [ -d "${TARGET_DIR}/${folder}" ]; then
            # If the folder exists, ask the user if they want to overwrite it
            WARN "Folder ${folder} already exists."
            WARN "Skipping overwrite of ${folder}"

            # If the folder does not exist, copy it
            RUN "Copied ${folder} successfully" "cp -r ${MODULES_DIR}/${folder} ${TARGET_DIR}/${folder}"
        fi
    done
}


copy_config_file() {
    for file in "${config_files[@]}"; do
        # Check if the file exists in the CURRENT_DIR
        if [ -f "${TARGET_DIR}/${file}" ]; then
            # If the file exists, ask the user if they want to overwrite it
            WARN "File ${file} already exists."
            WARN "Skipping overwrite of ${file}"
            GLOBAL_ERROR=true
        else
            # If the file does not exist, copy it
            RUN "Copied ${file} successfully" "cp ${MODULES_DIR}/${file} ${TARGET_DIR}/${file}"
        fi
    done
}

# --- Copy the global config files ---

DELIM "Global Config"
PROMPT "Copy global config files" copy_config_file
NEWLINE
if [ "$GLOBAL_ERROR" = true ]; then
    FAIL "Global config files copied with errors"
else
    PASS "Global config files copied"
fi


# --- Copy the global config folders ---

DELIM "Global Config Folders"
PROMPT "Copy global config folders" copy_config_folder
NEWLINE
if [ "$GLOBAL_ERROR" = true ]; then
    FAIL "Global config folders copied with errors"
else
    PASS "Global config folders copied"
fi