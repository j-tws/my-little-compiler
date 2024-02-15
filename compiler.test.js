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

  it('should correctly compile string interpolation variable assignment', () => {
    const rubyCode = `greeting = "hello #{name}"`
    const jsCode = "let greeting = `hello ${name}`"
    
    expect(compiler(rubyCode)).toBe(jsCode)
  })

  it('should correctly compile if only statement', () => {
    const rubyCode = `if true
      'hello world'
    end`
    const jsCode = `if (true){
      return 'hello world'
    }`
    
    expect(compiler(rubyCode)).toBe(jsCode)
  })
})
