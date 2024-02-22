const LETTERS = /[a-z]/i
const WHITESPACE = /\s/
const NUMBERS = /\d/

module.exports = function tokenizer(input) {
  const tokens = []
  let current = 0
  let stringFlag = false
  while (current < input.length) {
    let char = input[current]

    if (char === '(' || char === ')') {
      tokens.push({
        type: 'parenthesis',
        value: char,
      })
      current++
      continue
    }

    if (char === '=') {
      tokens.push({
        type: 'assignmentOperator',
        value: char,
      })
      current++
      continue
    }

    if (char === '#' && input[current + 1] === '{') {
      tokens.push({
        type: 'stringInterpolation',
        value: char,
      })
      current++
      continue
    }

    if (char === '{' || char === '}') {
      stringFlag = !stringFlag
      tokens.push({
        type: 'parenthesis',
        value: char,
      })
      current++
      continue
    }

    if (char === `"`) {
      stringFlag = !stringFlag
      tokens.push({
        type: 'doubleQuote',
        value: char,
      })
      current++
      continue
    }

    if (char === "'") {
      stringFlag = !stringFlag
      tokens.push({
        type: 'singleQuote',
        value: char,
      })
      current++
      continue
    }

    if (char === '\n') {
      tokens.push({
        type: 'newLine',
      })
    }

    if (LETTERS.test(char)) {
      let value = ''

      if (stringFlag) {
        while (char !== '#' && char !== "'") {
          value += char
          char = input[++current]
        }
        tokens.push({
          type: 'string',
          value,
        })
        continue
      }

      while (LETTERS.test(char) && char) {
        value += char
        char = input[++current]
      }

      if (value === 'if') {
        tokens.push({
          type: 'ifStatement',
          value,
        })
      } else if (value === 'end') {
        tokens.push({
          type: 'endStatement',
          value,
        })
      } else if (value === 'true' || value === 'false') {
        tokens.push({
          type: 'boolean',
          value,
        })
      } else {
        tokens.push({
          type: 'name',
          value,
        })
      }

      continue
    }

    if (WHITESPACE.test(char)) {
      current++
      continue
    }

    if (NUMBERS.test(char)) {
      let value = ''
      while (NUMBERS.test(char)) {
        value += char
        char = input[++current]
      }
      tokens.push({
        type: 'number',
        value,
      })
      continue
    }

    throw new TypeError(`Unknown char: ${char}`)
  }
  console.log('tokens:', tokens)
  return tokens
}
