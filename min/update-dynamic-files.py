#!/usr/bin/env python
import urllib2, os, sys

# Change directory to the location of this script
os.chdir(os.path.dirname(sys.argv[0]))

# Define an array of dynamic files that should be checked and possibly updated
files = [{
        "external": "https://script.google.com/macros/s/AKfycbzEVUBnYRqGOFS6309I9Oe748omXUWLjpDScrjYatNvxKuL6BEU/exec",
        "destination": "initialJSON.json"
    }, {
        "external": "https://script.google.com/macros/s/AKfycbxPwMbWpjuGXhg5btsB2-bWxLX7owBWZInnlIdmItbNDRWtiPU/exec",
        "destination": "sitemap.xml"
    }]

no_files_changed = True

# Loop through the files and apply changes if changed
for file in files:
    external_data = urllib2.urlopen(file["external"]).read()
    old_data = open(file["destination"], "r").read()
    if external_data != old_data:
        print(file["destination"]+" has changed => pushing changes")
        open(file["destination"], "w").write(external_data)
        os.system("git add "+file["destination"])
        no_files_changed = False

os.system("git commit --amend --no-edit")
os.system("git push -f")
