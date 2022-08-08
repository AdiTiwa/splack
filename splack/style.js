var defaultStyle = [
    { "cssFlag": "color", "stateful": false, "val": "white" },
    { "cssFlag": "font-size", "stateful": false, "val": 90 },
    { "cssFlag": "background-color", "stateful": false, "val": "white" },
    { "cssFlag": "padding", "stateful": false, "val": 10 },
    { "cssFlag": "padding-right", "stateful": false, "val": 10 },
    { "cssFlag": "padding-left", "stateful": false, "val": 10 },
    { "cssFlag": "padding-top", "stateful": false, "val": 10 },
    { "cssFlag": "padding-bottom", "stateful": false, "val": 10 },
]

var labelTies = [
    "textColor",
    "textSize",
    "backgroundColor",
    "padding",
    "paddingRight",
    "paddingLeft",
    "paddingTop",
    "paddingBottom"
]

function checkStyle(currentAstNode, cTkn, tokens) {
    let currentToken = cTkn
    let token = tokens[currentToken]
    
    function next(advanceAmount = 1) {
        currentToken += advanceAmount;

        if (currentToken >= tokens.length) {
            return false;
        }

        token = tokens[currentToken]
        return true;
    }

    while (true) {
        next()

        if (token["token_value"] == "rparan") {
            break
        } else if (token["token_value"] == "label" && token["value"] == "textColor") {
            next(2)
            if (token["value"] == "state") {
                next(2)

                currentAstNode["style"][0]["stateful"] = true
                currentAstNode["style"][0]["stateBind"] = token["value"]
            } else {
                currentAstNode["style"][0]["val"] = token["value"]
            }
        } else if (token["token_value"] == "label" && token["value"] == "textSize") {
            next(2)
            if (token["value"] == "state") {
                next(2)

                currentAstNode["style"][1]["stateful"] = true
                currentAstNode["style"][1]["stateBind"] = token["value"]
            } else {
                currentAstNode["style"][1]["val"] = token["value"]
            }
        }
    }

    return (currentAstNode)
}

exports.defaultStyle = defaultStyle;
exports.checkStyle = checkStyle;