var http = require('http')
var url = require('url')
var fs = require('fs')
var splack = require('./splack/splack.js')

http.createServer(function(req, res) {
    var q = url.parse(req.url, true)
    var filename = "./routes" + q.pathname

    if (q.pathname == "/") {
        filename = './routes/index'
    }

    var urlP = url.parse(req.url, true).query

    fs.readFile(filename + ".spk", 'utf8', function(err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' })
            return res.end("404: not found")
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.write(splack.run(data, urlP))

            return res.end()
        }
    })

}).listen(8000)