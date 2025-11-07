// frontend/src/components/ResourcePanel.jsx
import React, { useState } from 'react';
import ResourceCard from './ResourceCard';
// We no longer need to import ResourcePanel.css!

const ResourcePanel = ({ node, resources, onClose }) => {
  const [activeTab, setActiveTab] = useState('articles');

  const getTabs = () => {
    return [
      { id: 'articles', label: 'Articles', icon: '📄', count: resources.articles?.length || 0 },
      { id: 'videos', label: 'Videos', icon: '📺', count: resources.videos?.length || 0 },
      { id: 'books', label: 'Books', icon: '📚', count: resources.books?.length || 0 },
      { id: 'courses', label: 'Courses', icon: '🎓', count: resources.courses?.length || 0 },
    ];
  };

  const getResourcesForTab = () => {
    return resources[activeTab] || [];
  };

  const tabs = getTabs();
  const currentResources = getResourcesForTab();

  return (
    // On mobile, this is a full-width block. On desktop, it's a fixed-width sidebar.
    <div className="w-full lg:w-[380px] lg:max-w-md flex-shrink-0 bg-gradient-to-b from-card-bg to-bg-dark 
                    border-t-2 lg:border-t-0 lg:border-l-2 border-border-color 
                    flex flex-col h-full overflow-hidden">
      
      {/* Panel Header */}
      <div className="flex justify-between items-start p-4 md:p-6 border-b border-border-color bg-bg-dark/50">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-primary">{node?.data?.label}</h3>
          <p className="text-sm text-text-secondary mt-1">{node?.data?.description}</p>
        </div>
        <button 
          className="ml-4 p-2 text-text-secondary hover:text-primary transition-colors rounded-lg hover:bg-white/10" 
          onClick={onClose}
          title="Close panel"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-around p-2 border-b border-border-color">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-all
                       ${activeTab === tab.id ? 'text-primary' : 'text-text-secondary hover:text-primary hover:bg-white/5'}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="text-xs font-semibold relative">
              {tab.label}
              {tab.count > 0 && (
                <span className="absolute -top-1 -right-2.5 px-1.5 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded-full">
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {currentResources.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-secondary">
            <p>No {activeTab} available for this topic.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {currentResources.map((resource) => (
              <ResourceCard 
                key={resource.id} 
                resource={resource}
                type={activeTab}
                variant="compact" 
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border-color bg-bg-dark/50 text-center">
        <small className="text-xs text-text-secondary">Click resource to learn more</small>
      </div>
    </div>
  );
};

export default ResourcePanel;