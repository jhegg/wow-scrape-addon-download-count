# wow-scrape-addon-download-count
Scrapes the addon download count from CurseForge and WowInterface

## What is it?
This is a Node.JS script with a CLI that allows you to quickly fetch the
current download counts from a World of Warcraft addon which is published to
both WoWInterface and CurseForge.

## Requirements
* Node.JS 0.12 or newer
* An addon that is published to both WoWInterface and CurseForge

## How do I use it?
1. `npm install -g`
2. `wow-scrape-addon-download-count` (or `wow-scrape-addon-download-count.cmd`
   on Windows) to see the usage and an example command line.

## What does the output look like?
```
$ wow-scrape-addon-download-count.cmd \
    -n GoldCounter \
    -c http://wow.curseforge.com/addons/goldcounter/ \
    -w http://www.wowinterface.com/downloads/author-318870.html
GoldCounter Total Downloads: 298
CurseForge count: 234
WowInterface count: 64
```
