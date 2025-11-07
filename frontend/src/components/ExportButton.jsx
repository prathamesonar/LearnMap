import React, { useState, useEffect, useRef } from 'react';

const ExportButton = ({ nodes, edges, topic, level, className = '' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const exportAsJSON = () => {
    const data = {
      topic,
      level,
      exportedAt: new Date().toISOString(),
      nodes,
      edges,
      metadata: {
        nodeCount: nodes.length,
        edgeCount: edges.length,
      }
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${topic}-${level}-map-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const exportAsCSV = () => {
    let csv = 'ID,Title,Description,Type,Position X,Position Y\n';
    
    nodes.forEach(node => {
      const title = (node.data.label || '').replace(/"/g, '""');
      const desc = (node.data.description || '').replace(/"/g, '""');
      csv += `"${node.id}","${title}","${desc}","${node.type}","${node.position.x}","${node.position.y}"\n`;
    });

    const dataBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${topic}-${level}-nodes-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };
  

  const exportAsHTML = () => {
     alert('HTML export is a demo. For a full export, we would need to render the nodes to HTML.');
  
     setShowMenu(false);
  };

  const printMap = () => {
    window.print();
    setShowMenu(false);
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button 
        className="flex items-center justify-center gap-2 px-4 py-2 w-full bg-gradient-to-r from-secondary to-violet-500 text-white font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all"
        onClick={() => setShowMenu(!showMenu)}
      >
        📥 Export
      </button>

      {showMenu && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-card-bg border border-border-color rounded-lg shadow-2xl z-50 overflow-hidden animate-slideDown">
          <button 
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-text-primary hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={exportAsJSON}
          >
            <span className="text-lg">📄</span>
            <span>Export as JSON</span>
          </button>
          <button 
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-text-primary hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={exportAsCSV}
          >
            <span className="text-lg">📊</span>
            <span>Export as CSV</span>
          </button>
          <button 
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-text-primary hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={printMap}
          >
            <span className="text-lg">🖨️</span>
            <span>Print / Save PDF</span>
          </button>
        </div>
      )}
      
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default ExportButton;