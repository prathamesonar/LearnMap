const baseX = 0;
const baseY = 0;
const xSpacing = 320; 
const ySpacing = 240; 
let nodeYPositions = {};


function convertTreeToFlow(treeNode, depth = 0, parentId = null) {
  if (!treeNode) {
    return { nodes: [], edges: [] };
  }

  if (nodeYPositions[depth] === undefined) {
    nodeYPositions[depth] = baseY;
  }

  const position = {
    x: baseX + depth * xSpacing,
    y: nodeYPositions[depth],
  };

  nodeYPositions[depth] += ySpacing;

  let nodeType = 'default';
  if (depth === 0) nodeType = 'input';
  else if (!treeNode.children || treeNode.children.length === 0) nodeType = 'output';

  const node = {
    id: String(treeNode.id),
    type: nodeType,
    data: {
      label: treeNode.title,
      description: treeNode.description,
    },
    position,
    draggable: true,
    selectable: true,
  };

  let nodes = [node];
  let edges = [];

  if (parentId) {
    edges.push({
      id: `e-${parentId}-${treeNode.id}`,
      source: String(parentId),
      target: String(treeNode.id),
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#8b5cf6', strokeWidth: 2 },
    });
  }

  if (treeNode.children && treeNode.children.length > 0) {
    treeNode.children.forEach((childNode) => {
      const childFlow = convertTreeToFlow(childNode, depth + 1, treeNode.id);
      nodes = nodes.concat(childFlow.nodes);
      edges = edges.concat(childFlow.edges);
    });
  }

  return { nodes, edges };
}


function transformMapData(rootNode) {
  nodeYPositions = {};
  return convertTreeToFlow(rootNode);
}

module.exports = { transformMapData };