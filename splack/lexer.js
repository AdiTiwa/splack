function isLetter(str) {
    return typeof char !== str && /^[a-zA-z]+$/.test(str);
}

function isNumeric(val) {
    return /^-?\d+$/.test(val);
}

function lexer(code) {
    const tokens = []
    let currentOperation = 'none'
    let currentToken = {}

    for (let c of code) {
        switch (currentOperation) {
            case 'none':
                if (c == "[") {
                    tokens.push({
                        "token_value": "lparan",
                        "value": null,
                    })
                } else if (c == "]") {
                    tokens.push({
                        "token_value": "rparan",
                        "value": null,
                    })
                } else if (isLetter(c)) { // case they are letters
                    currentToken = {
                        "token_value": "label",
                        "value": c,
                    }
                    currentOperation = 'c-label'
                } else if (isNumeric(c)) { // case they are numbers
                    currentToken = {
                        "token_value": "number",
                        "value": c,
                    }
                    currentOperation = 'c-number'
                } else { // literally anything else
                    if (c == '"') {
                        currentToken = {
                            "token_value": "string",
                            "value": ""
                        }
                        currentOperation = 'c-string'
                    } else if (c == ";") {
                        tokens.push({
                            "token_value": "endl",
                            "value": null
                        })
                    }
                }
                break;
            case 'c-label':
                if (!(c == " ") && !(c == ";") && !(c == "|") && !(c == "-") && !(c == "]")) {
                    currentToken["value"] += c // any character after a label begins
                } else {
                    tokens.push(currentToken)
                    currentToken = {}
                    currentOperation = 'none'

                    if (c == ";") {
                        tokens.push({
                            "token_value": "endl",
                            "value": null,
                        })
                    } else if (c == "-") {
                        tokens.push({
                            "token_value": "set",
                            "value": null,
                        })
                    } else if (c == "|") {
                        tokens.push({
                            "token_value": "from",
                            "value": null,
                        })
                    } else if (c == "]") {
                        tokens.push({
                            "token_value": "rparan",
                            "value": null,
                        })
                    }
                }
                break;
            case 'c-string':
                if (!(c == '"') && !(c == '%') && !(c == "\n")) {
                    currentToken["value"] += c
                } else if (c == "%") {
                    tokens.push({
                        "token_value": "operation",
                        "value": null,
                    })
                    currentToken["value"] += c
                } else {
                    tokens.push(currentToken)
                    currentToken = {}
                    currentOperation = "none"

                    if (c == ";") {
                        tokens.push({
                            "token_value": "endl",
                            "value": null,
                        })
                    }
                }
                break;

            case 'c-number':
                if (isNumeric(c)) {
                    currentToken["value"] += c
                } else {
                    currentToken["value"] = parseInt(currentToken["value"]) // bully me if you want i just like this >:(
                    tokens.push(currentToken)
                    currentToken = {}
                    currentOperation = 'none'

                    if (c == ";") {
                        tokens.push({
                            "token_value": "endl",
                            "value": null,
                        })
                    } else if (c == "]") {
                        tokens.push({
                            "token_value": "rparan",
                            "value": null,
                        })
                    }
                }

                break;
            default:
                console.log("how did this happen???")
        }
    }

    if (currentToken["token_value"])
        tokens.push(currentToken)

    return (tokens)
}

exports.lexer = lexer