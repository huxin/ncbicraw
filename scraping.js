var casper = require('casper').create()
var links

function getLinks() {
  var links = document.querySelectorAll('ul.navigation li a')
  return Array.prototype.map.call(links, function (e) {
    return e.getAttribute('href')
  })
}

// Opens casperjs homepage
casper.start('http://casperjs.org')
