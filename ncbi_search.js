var links = []
var fs = require("fs")
var path = 'ahui_ncbi.links.txt'


var casper = require('casper').create({
  pageSettings: {
       userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
   }
})
// var url = 'https://www.ncbi.nlm.nih.gov/pubmed/?term=Anhui+Medical+University'
var url = 'https://www.ncbi.nlm.nih.gov/pubmed/?term=anhui'
var currentPage = 1
var links = []

var terminate = function() {
  this.echo("Exiting...").exit()
}


var change200 = function() {
  document.getElementById('ps200').click()
  this.waitForSelector('.rprt .title a')
}

function getLinks() {
  var links = document.querySelectorAll(".rprt .title a")
  return Array.prototype.map.call(links, function(e) {
    return e.getAttribute('href')
  })
}

function getCurrentPage() {
  var pageno = document.getElementById('pageno').value
  return parseInt(pageno)
}

// process page parse the page, find all the links
// and store them
var processPage = function() {
  // part 1: scrape and print links
  page_links = this.evaluate(getLinks)
  fs.write(path, page_links.join("\n")+"\n", 'a')

  links = links.concat(page_links)
  console.log("Scraping page: " + currentPage + " got: " + page_links.length + " links, total: ", links.length)

   // try to scrape 5 pages for now
   if (currentPage > 37 || !this.exists('.rprt .title a') || !this.exists('.active.page_link.next')) {
     return terminate.call(casper)
   }

  currentPage ++

  // click next page_links
  this.thenClick('.active.page_link.next').then(function() {
    this.waitForSelector('#pageno')
    this.waitFor(function() {
      return currentPage == this.evaluate(getCurrentPage)
    }, processPage, terminate)
  })
}



casper.start(url)
// select 200
casper.waitForSelector('#ps200', function() {
  this.evaluate(change200)
}, terminate)

// do scraping
casper.then(processPage)
casper.run()



// change to
// sel = document.querySelectorAll('#Display')
// size = sel[2]
// size.click()
// s200 = document.getElementById('ps200')
// s200.click()
