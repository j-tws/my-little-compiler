const compiler = require('./compiler')
const input = "text = 'hello world'"
// const input = "(add 2 (sub 4 3))"
// const input = "number = 50"
// const input = `greeting = "hello #{name}"`
// const input = `if true
//   'hello world'
// end`
const output = compiler(input)
console.log(JSON.stringify(output, null, 2))