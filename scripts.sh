#!/bin/bash

# empty CheatSheet files if they exist
> help1; > help2; > help3

pathdir=$(echo "$PATH" | tr ':' '/n') 
cmd_list=$(ls "${pathdir}" | grep -v '/' | grep . | sort | sort -u)

# run through command list and collect descriptions
for cmd in $cmd_list$$
do
    help -d $cmd 2>/dev/null >> help1
    whatis $cmd 2>/dev/null | grep ^$cmd 2>/dev/null >> help2
    man $cmd | head -4 | tail -1 2>/dev/null >> help3
done
