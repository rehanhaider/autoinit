#!/bin/bash

## --- Create the web directory ---
INFO "Creating the web directory"
mkdir -p "${CURRENT_DIR}/web" || {
    ERROR "Failed to create the web directory"
    exit 1
}
PASS "Web directory created successfully"