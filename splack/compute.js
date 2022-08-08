var fs = require('fs')

function compute(ast, urlParams) {
    var content = ""
    var titleContent = "Splack Website"
    var scriptContent = ""
    var fileContent = ''
    var state = {}

    ast.forEach(function (element, index) {
        switch (element["type"]) {
            case "state":
                state = element["values"]
                scriptContent = element["values"]
                break;
            case "heading1":
                var text = ""

                {
                    let currentLetter = 0
                    let l = element["text"][currentLetter]

                    function next(advanceAmount = 1) {
                        currentLetter += advanceAmount

                        if (currentLetter >= element["text"].length)
                            return false
                        l = element["text"][currentLetter]
                        return true
                    }

                    function look_to(advanceAmount = 1) {
                        if (currentLetter + advanceAmount >= element["text"].length)
                            return false

                        return element["text"][currentLetter + advanceAmount]
                    }

                    while (currentLetter < element["text"].length) {
                        if (l == "%" && look_to(1) == "[") {
                            next(2)

                            var resDict = undefined
                            if (l == "s" && look_to(1) == "t" && look_to(2) == "a" && look_to(3) == "t" && look_to(4) == "e") {
                                next(5)
                                resDict = state
                            } else if (l == "u" && look_to(1) == "r" && look_to(2) == "l") {
                                next(3)
                                resDict = urlParams
                            } else {
                                next(5)
                                resDict = state
                            }
                            
                            if (l == "|") {
                                next()

                                let variable = ''
                                while (l != "]") {
                                    variable += l
                                    next()
                                }

                                if (resDict[variable] != undefined)
                                    text += resDict[variable]
                            }
                        } else {
                            text += l
                        }

                        next()
                    }
                }

                var cssString = ""
                for (var style in element["style"]) {
                    if (element["style"][style]["stateful"]) {
                        if (state[element["style"][style]["stateBind"]] != undefined)
                            cssString += element["style"][style]["cssFlag"] + ":" + state[element["style"][style]["stateBind"]] + ";"
                    } else {
                        cssString += element["style"][style]["cssFlag"] + ":" + element["style"][style]["val"] + ";"
                    }
                }

                var classString = ''
                if (element["class"]["stateful"]) {
                    if (state[element["class"]["stateBind"]] != undefined)
                        classString += 'class = "' + state[element["class"]["stateBind"]] + '" ';
                } else {
                    classString += ' class = "' + element["class"]["val"] + '" '
                }

                content += '<h1 style="' + cssString + '" ' + classString + '>' + text + '</h1>\n'
                break;
            case 'title':
                if (element["stateful"]) {
                    if (state[element["stateBind"]] != undefined) {
                        titleContent = state[element["stateBind"]]
                    }
                }
                titleContent = element["val"]
                break;
        }
    })

    try {
        const fileRead = fs.readFileSync('./splack/template.html', 'utf-8').split(/\r?\n/)
        let fileContentArr = []
        fileRead.forEach(function(line) {
            if (!["{script}", "{content}", "{title}"].includes(line)) {
                fileContentArr.push(line)
            } else {
                switch (line) {
                    case "{script}":
                        fileContentArr.push(scriptContent)
                        break;
                    case "{content}":
                        fileContentArr.push(content)
                        break;
                    case "{title}":
                        fileContentArr.push(titleContent)
                        break;
                }
            }
        })

        fileContentArr.forEach(function(lContent) {
            fileContent += lContent + "\r\n"
        });
    } catch (error) {
        console.log("There was an error reading the html template file.")
        console.error(error)
    }

    return fileContent
}

exports.compute = compute;