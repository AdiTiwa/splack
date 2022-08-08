var lexer = require('./lexer')
var parser = require('./parser')
var compute = require('./compute')

function run(code, urlParams) {
    return compute.compute(parser.parser(lexer.lexer(code)), urlParams)
}

exports.run = run