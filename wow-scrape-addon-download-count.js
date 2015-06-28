#!/usr/bin/env node

var program = require('commander');
var request = require('request');
var cheerio = require('cheerio');

var curseForgeDownloadCount = undefined;
var wowInterfaceDownloadCount = undefined;

program
  .version('0.0.1')
  .usage('-n <addonName> -c <curseForgeAddonUrl> -w <wowInterfaceAuthorUrl>')
  .option('-c, --curseforge <url>', 'CurseForge Addon URL')
  .option('-w, --wowinterface <url>', 'WowInterface Author URL')
  .option('-n, --addonName <addonName>', 'Addon Name');

program.on('--help', function() {
  console.log('  Example:');
  console.log('    $ wow-scrape-addon-download-count -n GoldCounter'
    + ' -c http://wow.curseforge.com/addons/goldcounter/'
    + ' -w http://www.wowinterface.com/downloads/author-318870.html');
  console.log('');
})

program.parse(process.argv);

if (!program.addonName || !program.curseforge || !program.wowinterface) {
  console.error('Error:', 'One or more required arguments were not provided.');
  program.help();
  process.exit(1)
}

var addonName = program.addonName;
var curseForgeUrl = program.curseforge;
var wowInterfaceUrl = program.wowinterface;

function reportTotalIfReady() {
  if (curseForgeDownloadCount && wowInterfaceDownloadCount) {
    var total = curseForgeDownloadCount + wowInterfaceDownloadCount;
    console.log('GoldCounter Total Downloads: ' + total)
    console.log('CurseForge count: ' + curseForgeDownloadCount)
    console.log('WowInterface count: ' + wowInterfaceDownloadCount)
  }
}

function getDownloadCountFromScrapedCurseForgeHtml(html) {
  var $ = cheerio.load(html);
  var downloadsElement = $('dt:contains("Downloads")')
  var downloadCountElement = downloadsElement.next()
  curseForgeDownloadCount = Number(downloadCountElement.text())
}

function getDownloadCountFromScrapedWowInterfaceHtml(html) {
  var $ = cheerio.load(html);
  var titleElement = $('a:contains(' + addonName + ')')
  var titleRow = titleElement.parent().parent().parent()
  var downloadCountRow = titleRow.children().last()
  var downloadCountElement = downloadCountRow.children().first()
  wowInterfaceDownloadCount = Number(downloadCountElement.text())
}

function scrapeDownloadCountFromUrl(url, callback) {
  request(url, function(error, response, html) {
    if (!error && response.statusCode == 200) {
      callback(html)
      reportTotalIfReady()
    } else {
      if (error) throw error;
      console.error('Error: statusCode=' + response.statusCode + ', url=' + url)
    }
  });
}

scrapeDownloadCountFromUrl(curseForgeUrl, getDownloadCountFromScrapedCurseForgeHtml);
scrapeDownloadCountFromUrl(wowInterfaceUrl, getDownloadCountFromScrapedWowInterfaceHtml);
