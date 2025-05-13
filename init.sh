#!/bin/bash

set -e

echo "Cloning autoinit..."
rm -rf ~/.local/share/autoinit
git clone https://github.com/rehanhaider/autoinit.git ~/.local/share/autoinit > /dev/null 2>&1

echo "Installing autoinit..."
source ~/.local/share/autoinit/install.sh