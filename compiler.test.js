const compiler = require('./compiler')

test('it compile the example correctly', () => {
  const input = '(add 2 (sub 4 3))'
  const output = 'add(2, sub(4, 3));'

  expect(compiler(input)).toBe(output)
})

describe('Ruby to JS compiler', () => {
  is('should correctly compile simple string variable assignment', () => {
    const rubyCode = "text = 'hello world'"
    const jsCode = "let text = 'hello world'"
    
    expect(compiler(input)).toBe(output)
  })
})
