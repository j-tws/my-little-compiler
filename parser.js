module.exports = function parser(tokens) {
  let current = 0

  const walk = () => {
    let token = tokens[current]

    if (token.type === 'number') {
      current++
      return {
        type: 'NumberLiteral',
        value: token.value,
      }
    }

    if (token.type === 'string') {
      current++
      return {
        type: 'StringLiteral',
        value: token.value,
      }
    }

    if (token.type === 'boolean') {
      current++
      return {
        type: 'BooleanLiteral',
        value: token.value,
      }
    }

    if (token.type === 'doubleQuote') {
      const templateLiterals = {
        type: 'TemplateLiteral',
        values: [],
      }

      token = tokens[++current]

      while (token && token.value !== `"`) {
        templateLiterals.values.push(walk())
        token = tokens[current]
      }
      current++

      return templateLiterals
    }

    if (token.type === 'stringInterpolation') {
      const interpolation = {
        type: 'StringInterpolation',
        expressions: [],
      }
      current += 2
      token = tokens[current]

      while (token.value !== '}') {
        if (token.type === 'name') {
          interpolation.expressions.push({
            type: 'EmbeddedExpression',
            value: token.value,
          })
        }
        token = tokens[++current]
      }
      current++

      return interpolation
    }

    if (
      token.type === 'name' &&
      tokens[current + 1].type === 'assignmentOperator'
    ) {
      const variable = {
        type: 'LocalVariable',
        name: token.value,
        declarations: [],
      }

      token = tokens[++current]

      while (
        token.type === 'singleQuote' ||
        token.type === 'assignmentOperator'
      ) {
        token = tokens[++current]
      }

      while (token && token.type !== 'singleQuote') {
        variable.declarations.push(walk())
        token = tokens[current]
      }
      current++
      return variable
    }

    if (token.type === 'parenthesis' && token.value === '(') {
      token = tokens[++current]
      const expression = {
        type: 'CallExpression',
        name: token.value,
        params: [],
      }

      token = tokens[++current]
      while (token.value !== ')') {
        expression.params.push(walk())
        token = tokens[current]
      }
      current++
      return expression
    }

    if (token.type === 'ifStatement') {
      const ifStatement = {
        type: 'IfStatement',
        test: [],
        block: [],
      }

      
      token = tokens[++current]
      
      while (token.type !== 'newLine') {
        ifStatement.test.push(walk())
        token = tokens[current]
      }
      
      token = tokens[++current]
      
      while (token.type !== 'endStatement') {
        if (token.type === 'singleQuote' || token.type === 'newLine') {
          token = tokens[++current]
          continue
        }

        ifStatement.block.push(walk())
        token = tokens[current]
      }

      return ifStatement
    }

    throw new TypeError(`Unknown token: '${token.type}'`)
  }

  const ast = {
    type: 'Program',
    body: [walk()],
  }

  return ast
}
