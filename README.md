# Splack
A JS built compiler to HTML from custom markup, all from scratch.

```javascript
title "Hello Splack!"

state [
startingMessage-"Greetings!";
]

h1 style [textColor-gray textSize-96] "#[state-startingMessage]";
```

## Checklist

:white_check_mark: Initial Parsing
- ~~Lexer~~
- ~~Parser~~
- ~~Compute~~

:clock3: Tags
- headings
- text
- images
- buttons/inputs/form
  
:white_large_square: Components and Scripting
- components
- control flow
  - conditionals
  - loops

## Using the language
In short, don't try it yet! Everything is in heavy beta with many features half-baked, its more of an experimental idea for fun rather than a website development tool. If you would like to build a website with this, first clone the repository, or download the code directly from here.

If you are cloning the repository, follow these steps:
```
git clone https://github.com/AdiTiwa/splack.git
cd splack
```

Then, you need the files from the directory named splack. Select the directory and copy and paste it into the directory directly next to your entry level javascript file, or index.js.

Then create a folder named "routes" in the same directory that you kept the splack directory and the index.js file, and place a index.spk file in the routes directory, as well as a core folder in the base directory with an error.spk file. Your files should now look like this:

```
core
-  error.spk
routes
-  index.spk
splack
-  compute.js
-  lexer.js
-  parser.js
-  splack.js
-  style.js
-  template.html
index.js
```

The index.spk file is the / page for the website, add whatever code you would like. The error.spk file is the destination for the 404 error, or a path which doesn't exist after being requested. Any new routes will work in relation to the routes folder, (ex /hello/hi would be placed in a hello subdirectory in the routes folder with the hi.spk file) and can be made whenever. As to run the website, insert the following code in the index.js file-

```javascript
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
```
and run the command:
```
node index.js
```
and congratulations! The website is runnning on your computer, and you can view the website on the web at the link localhost:8000, or your local ip and the port 8000.