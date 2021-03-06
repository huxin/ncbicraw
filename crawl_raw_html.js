var fs = require('fs')
var timeoutfile =  "timeout_links.txt"
var timeoutf = fs.open(timeoutfile, 'a')

var casper = require('casper').create({
  stepTimeout: 10000,

  pageSettings: {
       userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
       "loadImages": false,
      "loadPlugins": false,
      "webSecurityEnabled": false,
      "ignoreSslErrors": true
   },
    onStepTimeout: function() {
        //throw new Error
        console.log("step timeout: " + this.requestUrl )
        timeoutf.write(this.requestUrl + "\n")

    }
})

var args = casper.cli['args']
var linkfile = 'ahmu_ncbi.links.txt.fulltext.link.txt'

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

var rawhtml_file = linkfile + ".raw.txt"
var linkIndx = 1

var rawf = fs.open(rawhtml_file, 'a')

casper.start()

for (var i=0; i < links.length; i ++) {
  if (links[i].length == 0) {
    continue
  }

  if (linkIndx < start) {
    linkIndx ++
    continue
  }

  var url = links[i]

  casper.thenOpen(url, function(){
    // get data
    var realURL = this.evaluate(function(){
      return document.URL
    })
    console.log("Crawling " + linkIndx + " link: " + realURL)
    linkIndx ++

    html_text = this.getHTML()
    output = "XXXXX-START-MMMMM-" + realURL + "\n" + html_text + "\n" + "\n"
    rawf.write(output)
    rawf.flush()
    fs.write(progress_file, linkIndx-1)
    })
}

casper.run(function() {
  rawf.close()
  timeoutf.close()
  this.exit()
})
