var page = require('webpage').create()
var url = 'https://www.ncbi.nlm.nih.gov/pubmed/?term=Anhui+Medical+University'


page.onConsoleMessage = function(msg) {
  console.log("log message: " + msg)
}


page.open(url, function(status){
  console.log("Status: " + status)

  if (status == "success") {

    page.evaluate(function () {
      console.log(document.title)
    })

  }

  phantom.exit()
})
