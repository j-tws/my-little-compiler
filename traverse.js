module.exports = function traverse(ast, visitors){
  const walkNode = (node, parent) => {
    const method = visitors[node.type]

    if (method) {
      method(node, parent)
    }

    if (node.type === 'Program') {
      walkNodes(node.body, node)
    } else if (node.type === 'CallExpression') {
      walkNodes(node.params, node)
    } else if (node.type === 'LocalVariable') {
      walkNodes(node.declarations, node)
    } else if (node.type === 'TemplateLiteral') {
      walkNodes(node.values, node)
    } else if (node.type === 'StringInterpolation') {
      walkNodes(node.expressions, node)
    } else if (node.type === 'IfStatementTest'){
      walkNodes(node.test)
    } else if (node.type === 'IfStatementBlock'){
      walkNodes(node.block)
    }
  }

  const walkNodes = (nodes, parent) => {
    nodes.forEach(node => walkNode(node, parent))
  }

  walkNode(ast, null)
}