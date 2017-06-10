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

if (args.length > 1) {
  start = parseInt(args[1])
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

var author_info_file = linkfile + ".authors.txt"
var linkIndx = 1

var authorf = fs.open(author_info_file, 'a')
var rawhtmlf = fs.open("rawhtml.txt", 'a')

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
      rawhtmlf.write(this.getHTML() + '\nXXXX-------------MMMM\n')
    })
  })
}

casper.run(function() {
  authorf.close()
  rawhtmlf.close()
  this.exit()
})
