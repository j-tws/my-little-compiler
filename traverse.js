module.exports = function traverse(ast, visitors){
  function walkNode(node, parent){
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
    }
  }

  function walkNodes(nodes, parent){
    nodes.forEach(node => walkNode(node, parent))
  }

  walkNode(ast, null)
}