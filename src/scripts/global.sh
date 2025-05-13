#!/bin/bash

GLOBAL_ERROR=false

config_files=(
    ".gitignore"
    ".prettierrc"
    "config.json"
    "Makefile"
    "requirements.txt"
    "ruff.toml"
)

copy_config_file() {
    for file in "${config_files[@]}"; do
        # Check if the file exists in the CURRENT_DIR
        if [ -f "${ROOT_DIR}/${file}" ]; then
            # If the file exists, ask the user if they want to overwrite it
            WARN "File ${file} already exists."
            WARN "Skipping overwrite of ${file}"
            GLOBAL_ERROR=true
        else
            # If the file does not exist, copy it
            RUN "Copied ${file} successfully" "cp ${CONFIG_DIR}/global/${file} ${TARGET_DIR}/${file}"
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


