#!/bin/bash

# Define color codes
# shellcheck disable=SC2034
COLOR_FAIL='\033[0;31m'
COLOR_PASS='\033[0;32m'
COLOR_WARN='\033[0;33m'
COLOR_INFO='\033[0m' # No Color
COLOR_BOLD='\033[1m'

DELIMITER="------------------------------------------------------------------------------------"

AUTOCONFIG_START="# AUTOCONFIG
# ------------------------------------------------------------------------------------------------------------"
AUTOCONFIG_END="# ------------------------------------------------------------------------------------------------------------
# END AUTOCONFIG"

# Initialize step counter (assuming you use print_delimiter)
STEP=0
# Default silent mode (can be overridden before sourcing/running)
SILENT_MODE=true

# Function to print colored text
# Usage: _rprint <color> [-n] <text>
_rprint() {
    local color="$1"
    shift
    local no_newline=false
    if [[ "$1" == "-n" ]]; then
        no_newline=true
        shift
    fi
    local text="$*"
    if $no_newline; then
        printf "%b%b%b" "$color" "$text" "\033[0m"
    else
        printf "%b%b%b\n" "$color" "$text" "\033[0m"
    fi
}


# --- Error coloring function (keeping your original logic) ---
err()(set -o pipefail;"$@" 2> >(sed $'s,.*,\e[31m&\e[m,'>&2))



# --- Color Output Functions (replacing aliases) ---
# Usage: info <message>
INFO() {
    _rprint "${COLOR_INFO}" "[INFO]: $*"
}

# Usage: pass <message>
PASS() {
    _rprint "${COLOR_PASS}" "[PASS]: $*"
}

# Usage: fail <message>
FAIL() {
    _rprint "${COLOR_FAIL}" "[FAIL]: $*" >&2 # Send FAIL messages to stderr
}

# Usage: warn <message>
WARN() {
    _rprint "${COLOR_WARN}" "[WARN]: $*" >&2 # Send WARN messages to stderr
}

# Usage: newline
NEWLINE() {
    _rprint "${COLOR_INFO}" -n "\n"
}


# --- Utility Functions  ---
# Usage: print_delimiter <message>
print_delimiter() {
    NEWLINE
    # Increment STEP *before* using it
    ((STEP++))
    _rprint "${COLOR_WARN}" "${DELIMITER}"
    _rprint "${COLOR_WARN}" "${DELIMITER}"
    _rprint "${COLOR_WARN}" -n "Step ${STEP}: "
    _rprint "${COLOR_WARN}" "$1"
    _rprint "${COLOR_WARN}" "${DELIMITER}"
}


# Usage: prompt_and_execute <message> <function_name>
# Note: If <function_name> needs to modify the parent shell's environment (like `cd`),
# remove the parentheses around `$func` inside the function.
prompt_and_execute() {
    local question=$1
    local func=$2

    if [ "${SILENT_MODE}" = false ]; then
        # shellcheck disable=SC1091
        while true; do
            read -r -p "Proceed with $question [Y/n] " yn
            case $yn in
                [Yy]* ) 
                        eval "$func"
                        PASS "${question^} ... Completed successfully"
                        break;;
                [Nn]* ) 
                        WARN "${question^} ... Skipped"
                        # shellcheck disable=SC2034
                        # for i in {1..8}; do echo -n "." && sleep 0.05; done;
                        echo ""
                        break;;
                * ) echo -e "\nPlease answer Y or N.";;
            esac
        done
    else
        eval "$func"
    fi
}

run_command() {
    local message=$1
    local command=$2


    if eval "err ${command}"; then
        PASS "${message} completed successfully."
    else
        FAIL "Failed to execute: ${message}. Please ensure you have the necessary permissions. Exiting ..."
        exit 1
    fi
}






alias PROMPT='prompt_and_execute'
alias RUN='run_command'
alias DELIM='print_delimiter'
