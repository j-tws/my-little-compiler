const compiler = require('./compiler')
const input = "string = 'hello'"
const output = compiler(input)
console.log(JSON.stringify(output, null, 2))