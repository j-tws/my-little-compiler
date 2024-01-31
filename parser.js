module.exports = function parser(tokens) {
  let current = 0
  console.log(tokens)
  const walk = () => {
    let token = tokens[current]
    if (token.type === 'number') {
      current++
      return {
        type: 'NumberLiteral',
        value: token.value
      }
    }

    if (token.type === 'name' && tokens[current + 1].type === 'assignmentOperator') {
      const variable = {
        type: 'LocalVariable',
        name: token.value,
      }

      current += 2
      token = tokens[current]

      let string = ''
      if (token.type === 'singleQuote'){
        token = tokens[++current]
        while (token.value !== "'"){
          string += token.value
          if (tokens[current + 1] !== "'"){
            string += ' '
          }
          token = tokens[++current]
        }
        variable.value = {
          type: 'string',
          value: string
        }
      }

      return variable
    }

    if (token.type === 'parenthesis' && token.value === '('){
      token = tokens[++current]
      const expression = {
        type: 'CallExpression',
        name: token.value,
        params: []
      }

      token = tokens[++current]
      while (token.value !== ')'){
        expression.params.push(walk())
        token = tokens[current]
      }
      current++
      return expression
    }

    throw new TypeError(`Unknown token: '${token.type}'`)
  }

  const ast = {
    type: 'Program',
    body: [walk()]
  }
  console.log(ast)
  return ast
}