module.exports = function generateCode(node) {
  if (node.type === 'NumericLiteral' || node.type === 'EmbeddedExpression') {
    return node.value
  }
  if (node.type === 'StringLiteral') {
    return `'${node.value}'`
  }
  if (node.type === 'Identifier') {
    return node.name
  }
  if (node.type === 'CallExpression') {
    return `${generateCode(node.callee)}(${node.arguments.map(generateCode).join(', ')})`
  }
  if (node.type === 'ExpressionStatement') {
    return `${generateCode(node.expression)};`
  }
  if (node.type === 'VariableDeclarator') {
    return `let ${node.name} = ${node.declarations.map(generateCode)}`
  }
  if (node.type === 'Program') {
    return node.body.map(generateCode).join('\n')
  }
  if (node.type === 'TemplateLiteral') {
    const output = node.values.map(node => {
      if (node.type === 'StringLiteral') {
        return node.value
      } else {
        return '${' + node.expressions.map(generateCode).join('') + '}'
      }
    })

    return '`' + output.join('') + '`'
  }
  if (node.type === 'BooleanLiteral') {
    return `${node.value}`
  }
  if (node.type === 'IfStatement') {
    let condition = `if (${node.test.map(generateCode)}){`

    let block = `${node.block.map(generateCode)}`

    return `${condition}
      ${block}
    }`
  }
}
