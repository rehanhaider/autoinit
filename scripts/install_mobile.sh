#!/bin/bash

## --- Create the mobile directory ---
INFO "Creating the mobile directory"
mkdir -p "${CURRENT_DIR}/mobile" || {
    ERROR "Failed to create the mobile directory"
    exit 1
}
PASS "Mobile directory created successfully"