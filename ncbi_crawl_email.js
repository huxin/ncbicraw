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
var linkfile = 'anhui.links.txt.fulltext.link.txt'
var start = 1

if (args.length > 0) {
  linkfile = args[0]
}

var progress_file = linkfile + '.progress'

if (args.length > 1) {
  start = parseInt(args[1])
} else {
  if (fs.exists(progress_file)) {
    var content = fs.read(progress_file)
    start = parseInt(content)
  }
}



console.log("reading links from: " + linkfile)
var content = fs.read(linkfile)
var links = content.split('\n')
var emailPatt = /[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/g

var searchEmail = function(s) {
  var o = {}

  match = emailPatt.exec(s)

  while (match != null) {
    email = match[0]
    match = emailPatt.exec(s)
    o[email] = 1
  }

  return Object.keys(o)
}


var email_file = linkfile + ".email.txt"
var linkIndx = 1

var emailf = fs.open(email_file, 'a')

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
    emails = searchEmail(html_text)

    if (emails.length == 0) {
      // if didn't find email, let's wait for a few seconds and try again
      emails.push("NONE")
    }

    for (var i = 0; i < emails.length; i ++) {
      output = emails[i] + " " + realURL + "\n"
      emailf.write(output)
    }
    console.log("\tfound " + emails.length + " emails")
    fs.write(progress_file, linkIndx-1)
    })
}

casper.run(function() {
  emailf.close()
  timeoutf.close()
  this.exit()
})
