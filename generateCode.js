module.exports = function generateCode(node){
  if (node.type === 'NumericLiteral') {
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
    return node.body.map(generateCode).join('\n');
  }
  if (node.type === 'TemplateLiteral') {
    let output = ''
    node.values.forEach((value, index) => {
      if (value.type === 'StringLiteral'){
        output += value.value
        if (node.values[index + 1]) output += ' '
      } else {
        let interpolation = '${'
        value.expressions.forEach(expression => interpolation += expression.value)
        interpolation += '}'
        output += interpolation
        if (node.values[index + 1]) output += ' '
      }
    })
    return '`' + output + '`'
  }
}