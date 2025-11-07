import React, { useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

const CustomNode = ({ data, selected }) => {
  const nodeType = data.nodeType || 'default';
  
  const baseClasses = 'custom-node py-6 px-4 rounded-xl shadow-xl cursor-pointer min-w-[200px] border-2 transition-all duration-300 transform';
  
  const typeClasses = {
    input: 'bg-primary/10 border-primary hover:shadow-primary/30',
    default: 'bg-secondary/10 border-secondary hover:shadow-secondary/30',
    output: 'bg-tertiary/10 border-tertiary hover:shadow-tertiary/30',
  };
  
  const selectedClasses = selected 
    ? 'scale-105 shadow-2xl ring-2 ring-white/50' 
    : 'hover:-translate-y-1';

  return (
    <div 
      className={`${baseClasses} ${typeClasses[nodeType]} ${selectedClasses}`}
    >
      <Handle type="target" position={Position.Left} className="!opacity-0 !w-2 !h-2" />

      <div className="flex items-center gap-2">
        <div className="text-xl">
          {nodeType === 'input' ? '📍' : nodeType === 'output' ? '✓' : '📚'}
        </div>
        <div className="node-title font-bold text-base text-text-primary leading-tight">
          {data.label}
        </div>
      </div>
      
      <div className="node-description text-xs text-text-secondary leading-snug mt-2 pt-2 border-t border-white/10 transition-all duration-300">
        {data.description}
      </div>

      <div className="node-footer text-xs text-gray-400 mt-2 transition-opacity duration-300">
        Click for resources
      </div>

      <Handle type="source" position={Position.Right} className="!opacity-0 !w-2 !h-2" />
      
    </div>
  );
};

// Memoize nodeTypes to prevent React Flow warnings
const nodeTypes = {
  default: CustomNode,
  input: CustomNode,
  output: CustomNode,
};

const LearningMap = ({ initialNodes, initialEdges, onNodeClick }) => {
  const preparedNodes = useMemo(() => {
    return initialNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        nodeType: node.type || 'default',
      },
    }));
  }, [initialNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(preparedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="learning-map-wrapper absolute inset-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_event, node) => onNodeClick(node)}
        fitView
        attributionPosition="bottom-right"
        className="bg-gradient-to-br from-bg-darker to-bg-dark"
      >
        <Background variant="dots" gap={12} size={1} className="text-gray-700/50" />
        <Controls position="top-left" className="!shadow-xl !bg-card-bg/90 !border-border-color" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.type === 'input') return '#06b6d4';
            if (n.type === 'output') return '#ec4899';
            return '#8b5cf6';
          }}
          nodeStrokeWidth={2}
          zoomable
          pannable
          className="!bg-bg-dark/90 !border-border-color !rounded-lg"
        />
      </ReactFlow>
    </div>
  );
};

export default LearningMap;