const traverse = require('./traverse')

module.exports = function transformer(originalAST) {
  const jsAST = {
    type: 'Program',
    body: [],
  }

  let position = jsAST.body

  const visitors = {
    NumberLiteral(node) {
      position.push({
        type: 'NumericLiteral',
        value: node.value,
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
          name: node.name,
        },
        arguments: [],
      }
      const prevPosition = position
      position = expression.arguments
      if (parent.type !== 'CallExpression') {
        expression = {
          type: 'ExpressionStatement',
          expression,
        }
      }
      prevPosition.push(expression)
    },
    LocalVariable(node) {
      let variable = {
        type: 'VariableDeclarator',
        name: node.name,
        declarations: [],
      }

      position.push(variable)
      position = variable.declarations
    },
    TemplateLiteral() {
      let template = {
        type: 'TemplateLiteral',
        values: [],
      }

      position.push(template)
      position = template.values
    },
    StringInterpolation() {
      let interpolation = {
        type: 'StringInterpolation',
        expressions: [],
      }

      position.push(interpolation)
      position = interpolation.expressions
    },
    EmbeddedExpression(node) {
      position.push({
        type: 'EmbeddedExpression',
        value: node.value,
      })
    },
    BooleanLiteral(node) {
      position.push({
        type: 'BooleanLiteral',
        value: node.value,
      })
    },
  }

  const ifStatementVisitor = {
    IfStatement(node) {
      const testNode = { type: 'IfStatementTest', test: [...node.test] }
      const blockNode = { type: 'IfStatementBlock', block: [...node.block] }

      let statement = {
        type: 'IfStatement',
        test: [],
        block: [],
      }

      const prevPosition = position

      position.push(statement)
      position = statement.test
      traverse(testNode, visitors)

      position = statement.block
      traverse(blockNode, visitors)

      position = prevPosition
    },
  }

  traverse(originalAST, { ...visitors, ...ifStatementVisitor })
  console.log('jsAST:', jsAST.body[0])
  return jsAST
}
