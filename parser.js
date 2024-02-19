module.exports = function parser(tokens) {
  let current = 0
  let insideTemplateLiteral = false
  let insideSingleQuote = false

  const walk = () => {
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
      insideSingleQuote = true

      while (token.value !== "'"){
        string += token.value
        if (tokens[current + 1].value !== "'"){
          string += ' '
        }
        token = tokens[++current]
      }

      insideSingleQuote = false
      current++

      return {
        type: 'StringLiteral',
        value: string
      }
    }

    if (token.type === 'name' && insideTemplateLiteral){
      return {
        type: 'StringLiteral',
        value: token.value,
      }
    }

    if (token.type === 'doubleQuote'){
      const templateLiterals = {
        type: 'TemplateLiteral',
        values: []
      }

      token = tokens[++current]
      insideTemplateLiteral = true

      while (token.value !== `"`){
        templateLiterals.values.push(walk())
        current++
        token = tokens[current]
      }
      current++
      insideTemplateLiteral = false
      
      return templateLiterals
    }

    if (token.type === 'stringInterpolation'){
      insideTemplateLiteral = true

      const interpolation = {
        type: 'StringInterpolation',
        expressions: []
      }

      current += 2
      token = tokens[current]

      while (token.value !== '}'){
        if (token.type === 'name'){
          interpolation.expressions.push({
            type: 'EmbeddedExpression',
            value: token.value
          })
        }
        token = tokens[++current]
      }
      insideTemplateLiteral = false

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

    if (token.value === 'true' && !insideSingleQuote){
      return {
        type: 'BooleanLiteral',
        value: true
      }
    }

    if (token.type === 'ifStatement'){
      const ifStatement = {
        type: 'IfStatement',
        test: [],
        block: []
      }

      token = tokens[++current]
      
      while (token.type !== 'newLine'){
        ifStatement.test.push(walk())
        token = tokens[++current]
      }
      
      token = tokens[++current]

      while (token.type !== 'endStatement'){
        ifStatement.block.push(walk())
        token = tokens[++current]
      }

      return ifStatement
    }

    if (token.type === 'newLine' || token.type === 'endStatement') return

    throw new TypeError(`Unknown token: '${token.type}'`)
  }

  const ast = {
    type: 'Program',
    body: [walk()]
  }
  console.log(ast.body[0])

  return ast
}