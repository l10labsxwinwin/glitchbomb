#!/bin/bash
# File watcher for running sozo build on changes in src/

watchexec --watch src --exts cairo --clear --restart -- sozo build
