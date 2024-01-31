const compiler = require('./compiler')

test('it compile the example correctly', () => {
  const input = '(add 2 (sub 4 3))'
  const output = 'add(2, sub(4, 3));'

  expect(compiler(input)).toBe(output)
})

describe('Ruby to JS compiler', () => {
  it('should correctly compile simple string variable assignment', () => {
    const rubyCode = "text = 'hello world'"
    const jsCode = "let text = 'hello world'"
    
    expect(compiler(rubyCode)).toBe(jsCode)
  })

  it('should correctly compile simple integer variable assignment', () => {
    const rubyCode = "number = 50"
    const jsCode = "let number = 50"
    
    expect(compiler(rubyCode)).toBe(jsCode)
  })

})
