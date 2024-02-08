const traverse = require('./traverse')

module.exports = function transformer(originalAST) {
  const jsAST = {
    type: 'Program',
    body: []
  }

  let position = jsAST.body

  traverse(originalAST, {
    NumberLiteral(node) {
      position.push({
        type: 'NumericLiteral',
        value: node.value
      })
    },
    StringLiteral(node) {
      position.push({
        type: 'StringLiteral',
        value: node.value,
      })
    },
    CallExpression(node, parent) {
      let expression = {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: node.name
        },
        arguments: []
      }
      const prevPosition = position
      position = expression.arguments
      if (parent.type !== 'CallExpression') {
        expression = {
          type: 'ExpressionStatement',
          expression
        }
      }
      prevPosition.push(expression)
    },
    LocalVariable(node){
      let variable = {
        type: 'VariableDeclarator',
        name: node.name,
        declarations: []
      }

      position.push(variable)
      position = variable.declarations
    },
    TemplateLiteral(){
      let template = {
        type: 'TemplateLiteral',
        values: []
      }

      position.push(template)
      position = template.values
    },
    StringInterpolation(){
      let interpolation = {
        type: 'StringInterpolation',
        expressions: []
      }

      position.push(interpolation)
      position = interpolation.expressions
    },
    EmbeddedExpression(node){
      position.push({
        type: 'EmbeddedExpression',
        value: node.value,
      })
    }
  })
  return jsAST
}