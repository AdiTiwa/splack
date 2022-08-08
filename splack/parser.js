var style = require('./style');

function parser(tokens) {
    var currentToken = 0
    var token = tokens[currentToken]
    var ast = []
    var currentNode

    function next(advanceAmount = 1) {
        currentToken += advanceAmount;

        if (currentToken >= tokens.length) {
            return false;
        }

        token = tokens[currentToken]
        return true;
    }

    function look_to(futureAmount = 1) {
        if (currentToken + futureAmount >= tokens.length) {
            return false;
        }

        return tokens[currentToken + futureAmount]
    }

    while (true) {
        if (token["token_value"] == "label") {
            if (token["value"] == "h1") {
                currentNode = ast.push({
                    "type": "heading1",
                    "style": style.defaultStyle,
                    "text": {"val": "", "stateful": false},
                    "class": {"val": "", "stateful": false},
                }) - 1

                while (true) {
                    if (!(next()))
                        break;

                    if (token["token_value"] == "endl") {
                        break;
                    } else if (token["token_value"] == "label" && token["value"] == "style") {
                        next()

                        ast[currentNode] = style.checkStyle(ast[currentNode], currentToken, tokens)
                    } else if (token["token_value"] == "operation") {
                        next()

                        ast[currentNode]["stateful"] = true
                        ast[currentNode]["text"] = token['value']
                    } else if (token["token_value"] == "string") {
                        ast[currentNode]["text"] = token["value"]
                    } else if (token["value"] == "className") {
                        next(2)
                        if (token["value"] == "state") {
                            next(2)

                            ast[currentNode]['class']["stateful"] = true
                            ast[currentNode]['class']["stateBind"] = token["value"]
                        } else {
                            ast[currentNode]['class']["val"] = token["value"]
                        }
                    }
                }
            } else if (token["value"] == "state") {
                currentNode = ast.push({
                    "type": "state",
                    "values": {}
                }) - 1

                next()

                while (true) {
                    next()

                    if (token["token_value"] == "rparan") {
                        break
                    } else if (token["token_value"] == "label") {
                        var newStateName = token["value"]
                        ast[currentNode]["values"][token["value"]] = null
                        
                        next(2)
                        ast[currentNode]["values"][newStateName] = token["value"]
                    }
                }
            } else if (token["value"] == "title") {
                next()

                currentNode = ast.push({
                    "type": "title",
                    "stateful": false,
                    "val": "Splack Website"
                }) - 1

                if (token["value"] == "state") {
                    next(2)

                    ast[currentNode]["stateful"] = true
                    ast[currentNode]["stateBind"] = token["value"]
                } else {
                    ast[currentNode]["val"] = token["value"]
                }
            }
        }

        if (!next())
            break
    }

    return (ast)
}

exports.parser = parser