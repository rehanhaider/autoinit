#!/bin/bash
shopt -s expand_aliases

## Set the directories
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_DIR="${ROOT_DIR}/src/scripts"
CONFIG_DIR="${ROOT_DIR}/src/config"
LIB_DIR="${ROOT_DIR}/src/lib"

## Set the target directory
TARGET_DIR="$(pwd)"

## Set the default values
SILENT_MODE=true
ALL_MODULES=false

source "${LIB_DIR}/macro.sh"
# Set silent mode
while getopts ":iah" opt; do
	case ${opt} in
		i )
			SILENT_MODE=false
			echo "Interactive mode"
			;;
		a )
			ALL_MODULES=true
			echo "Install all modules"
			;;
		h )
			echo "Usage: $0 [-i]"
			echo "Options:"
			echo "  -i  Interactive mode"
			echo "  -a  Install all modules"
			echo "  -h  Show this help message"
			exit 0
			;;
		* )
			echo "Usage: $0 [-i]"
			echo "Options:"
			echo "  -i  Interactive mode"
			echo "  -a  Install all modules"
			echo "  -h  Show this help message"
			exit 1
			;;
	esac
done



# Starting the script
if [ "$SILENT_MODE" = false ]; then
    INFO "Starting autoinit in interactive mode"
else
    INFO "Starting autoinit in silent mode"
fi

source "${SCRIPT_DIR}/global.sh"


# --- Modules ---
## List of modules to install

MODULES=(
    "aws"
    # "web"
    # "mobile"
    # "admin"
)

check_module_exists() {
    if [ -d "${ROOT_DIR}/${module}" ]; then
        return 0
    else
        return 1
    fi
}



## Interactively ask the user if they want to install each module
ORIGINAL_SILENT_MODE=$SILENT_MODE
## Turn off silent mode for interactive mode
if [ "$ALL_MODULES" = false ]; then
	SILENT_MODE=false
fi
for module in "${MODULES[@]}"; do
	DELIM "Installation of ${module^^} module"
	if check_module_exists "${module}"; then
		WARN "Module ${module^^} already exists"
		FAIL "Skipping installation of ${module^^} module"
		continue
	fi
	PROMPT "creation of ${module^^} module" "source ${SCRIPT_DIR}/install_${module}.sh"
done

