var request = require('request');
var cheerio = require('cheerio');

var curseForgeDownloadCount = undefined;
var wowInterfaceDownloadCount = undefined;

// var url = process.argv[2];
var addonName = 'GoldCounter';
var curseForgeUrl = 'http://wow.curseforge.com/addons/goldcounter/';
var wowInterfaceUrl = 'http://www.wowinterface.com/downloads/author-318870.html'

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
      console.error('Error: statusCode=' + response.statusCode)
    }
  });
}

scrapeDownloadCountFromUrl(curseForgeUrl, getDownloadCountFromScrapedCurseForgeHtml);
scrapeDownloadCountFromUrl(wowInterfaceUrl, getDownloadCountFromScrapedWowInterfaceHtml);
