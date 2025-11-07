import React, { useState } from 'react';
import ResourceCard from './ResourceCard';
import '../styles/NodeModal.css';

const NodeModal = ({ node, onClose }) => {
  const [activeTab, setActiveTab] = useState('articles');
  const resources = node.resources || {};

  const getTabs = () => {
    return [
      { id: 'articles', label: '📄 Articles', count: resources.articles?.length || 0 },
      { id: 'videos', label: '🎥 Videos', count: resources.videos?.length || 0 },
      { id: 'books', label: '📚 Books', count: resources.books?.length || 0 },
      { id: 'courses', label: '🎓 Courses', count: resources.courses?.length || 0 },
    ];
  };

  const getResourcesForTab = () => {
    return resources[activeTab] || [];
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">{node.data.label}</h2>
            <p className="modal-description">{node.data.description}</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-tabs">
          {getTabs().map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.count > 0 && <span className="tab-count">{tab.count}</span>}
            </button>
          ))}
        </div>

        <div className="modal-body">
          {getResourcesForTab().length === 0 ? (
            <div className="empty-resources">
              <p>No {activeTab} available for this topic yet.</p>
            </div>
          ) : (
            <div className="resources-grid">
              {getResourcesForTab().map((resource) => (
                <ResourceCard 
                  key={resource.id} 
                  resource={resource}
                  type={activeTab}
                />
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <p className="modal-hint"> Click on any resource to learn more</p>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default NodeModal;