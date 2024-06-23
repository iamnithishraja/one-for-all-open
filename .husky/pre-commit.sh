#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Define the unwanted lock files
unwanted_files=("package-lock.json")

# Check for unwanted lock files in the staged changes
for file in "${unwanted_files[@]}"; do
    if git diff --cached --name-only | grep -qE "^$file$"; then
        echo "Error: Commits containing '$file' are not allowed. Please use Yarn and remove this file from your commit."
        exit 1
    fi
done