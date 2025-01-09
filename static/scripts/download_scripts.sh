#!/usr/bin/env bash
#
# Bash because $BASH_SOURCE is really useful.
#

set -x

cd "${BASH_SOURCE[0]%/*}"

curl -Lo linebreak.js 'https://unpkg.com/tex-linebreak@latest/dist/lib.js'
curl -Lo hyphens_en-us.js 'https://unpkg.com/tex-linebreak@latest/dist/hyphens_en-us.js'
