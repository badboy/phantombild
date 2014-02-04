#phantombild
===========

A phantomjs module to remotely create viewport constrained screenshots of a website via http interface. 

## Prerequisit:
    
    phantomjs

## Usage:

    git clone git@github.com:snnd/phantombild.git
    cd phantombild
    phantomjs src/phantombild.js

## Get screenshot 

Get screenhot of http://www.github.com/snnd/phantombild?ignore=this

    wget http://localhost:8081/capture/?targetUrl=http%3a%2f%2fwww.github.com%2fsnnd%2fphantombild%3fignore%3dthis -O screenshot.png

## Author

Dennis John Wilson <hello@abakia.de>
