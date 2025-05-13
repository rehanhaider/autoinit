#!/bin/bash

## --- Create the admin directory ---
INFO "Creating the admin directory"
mkdir -p "${CURRENT_DIR}/admin" || {
    ERROR "Failed to create the admin directory"
    exit 1
}
PASS "Admin directory created successfully"