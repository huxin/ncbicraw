var fs = require('fs')

var casper = require('casper').create({
  pageSettings: {
       userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
   }
})

// 3394

var args = casper.cli['args']
var linkfile = 'ahmu_ncbi.links.txt'
var start = 1


if (args.length > 0) {
  linkfile = args[0]
}

var progress_file = linkfile + '.progress'

if (args.length > 1) {
  start = parseInt(args[1])
} else {
  // read progress file and parseInt
  if (fs.exists(progress_file)) {
    var content = fs.read(progress_file)
    start = parseInt(content)
  }
}


console.log("reading links from: " + linkfile)
var content = fs.read(linkfile)
var links = content.split('\n')

var getAuthorInfo = function() {
  var authors = document.querySelectorAll('.ui-ncbi-toggler-slave.ui-ncbitoggler.ui-ncbitoggler-slave')[0]
  var dds = authors.querySelectorAll('dd')
  var author_lines = []

  for (var i = 0; i < dds.length; i ++) {
    author_lines.push(dds[i].textContent)
  }
  return author_lines
}

var getFullTextLink = function() {
  var portlets = document.querySelectorAll('.icons.portlet')
  var fulltextlinks = []
  for (var i = 0; i < portlets.length; i ++) {
    var p = portlets[i]
    var as = p.querySelectorAll('a')
    for (var j = 0; j < as.length; j ++) {
      fulltextlinks.push(as[j].href)
    }
  }
  return fulltextlinks
}


var author_info_file = linkfile + ".authors.txt"
var fulltext_link_file = linkfile + '.fulltext.link.txt'
var linkIndx = 1

var authorf = fs.open(author_info_file, 'a')

var ftlf = fs.open(fulltext_link_file, 'a')

casper.start()

for (var i=0; i < links.length; i ++) {
  if (links[i].length == 0) {
    continue
  }

  if (linkIndx < start) {
    linkIndx ++
    continue
  }

  var url = "https://www.ncbi.nlm.nih.gov" + links[i]

  casper.thenOpen(url, function(){
    // get data
    var realURL = this.evaluate(function(){
      return document.URL
    })
    console.log("Crawling " + linkIndx + " link: " + realURL)
    linkIndx ++
    this.waitForSelector('.ui-ncbi-toggler-slave.ui-ncbitoggler.ui-ncbitoggler-slave', function(){
      var author_lines = this.evaluate(getAuthorInfo)
      var output = "url: " + realURL + "\n" + author_lines.join('\n') + "\n"
      authorf.write(output)

      var fulltextlinks = this.evaluate(getFullTextLink)
      ftlf.write(fulltextlinks.join("\n")+"\n")
      ftlf.flush()
      fs.write(progress_file, linkIndx-1)
      fs.flush()
    })
  })
}

casper.run(function() {
  authorf.close()
  ftlf.close()
  this.exit()
})
