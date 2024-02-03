module.exports = function parser(tokens) {
  let current = 0
  console.log('tokens:', tokens)
  const walk = () => {
    console.log(tokens)
    let token = tokens[current]
    if (token.type === 'number') {
      current++
      return {
        type: 'NumberLiteral',
        value: token.value
      }
    }

    if (token.type === "singleQuote"){
      token = tokens[++current]
      let string = ''

      while (token.value !== "'"){
        string += token.value
        if (tokens[current + 1].value !== "'"){
          string += ' '
        }
        token = tokens[++current]
      }
      current++

      return {
        type: 'StringLiteral',
        value: string
      }
    }

    if (token.type === 'doubleQuote'){
      const templateLiterals = {
        type: 'TemplateLiteral',
        values: []
      }
    }

    if (token.type === 'stringInterpolation'){
      const interpolation = {
        type: 'StringInterpolation',
        expressions: []
      }

      current += 2
      token = tokens[current]

      while (token.value !== '{'){
        if (token.type === 'name'){
          interpolation.expressions.push({
            type: 'EmbeddedExpresions',
            value: token.value
          })
        }
      }

      return interpolation
    }

    if (token.type === 'name' && tokens[current + 1].type === 'assignmentOperator') {
      const variable = {
        type: 'LocalVariable',
        name: token.value,
        declarations: []
      }

      current += 2
      token = tokens[current]

      while (token){
        variable.declarations.push(walk())
        token = tokens[current]
      }
      current++
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
  return ast
}