
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TopicForm from './components/TopicForm';
import LearningMap from './components/LearningMap';
import ResourcePanel from './components/ResourcePanel.jsx';
import ExportButton from './components/ExportButton';
import { getLearningMap } from './services/api';
import { loadSearchHistory, saveToHistory } from './services/storage';

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [resources, setResources] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  useEffect(() => {
    setSearchHistory(loadSearchHistory());
  }, []);

  const handleGenerateMap = async (topic, level) => {
    setIsLoading(true);
    setError(null);
    setShowMap(false);
    setSelectedNode(null);
    setCurrentTopic(topic);
    setCurrentLevel(level);
    setResourcesOpen(false);

    try {
      const data = await getLearningMap(topic, level);
      
      if (!data.nodes || !data.edges) {
        throw new Error('Invalid response from server');
      }

      setNodes(data.nodes);
      setEdges(data.edges);
      setResources(data.resources || {});
      setIsCached(data.cached || false);
      setShowMap(true);
      
      saveToHistory(topic, level);
      setSearchHistory(loadSearchHistory());
    } catch (err) {
      console.error('Error generating map:', err);
      setError(err.message);
      setShowMap(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setResourcesOpen(true);
  };

  // This function is for the "Show/Hide Resources" button on mobile/tablet
  const toggleResources = () => {
    if (!selectedNode && nodes.length > 0) {
      setSelectedNode(nodes.find(n => n.type === 'input') || nodes[0]);
    }
    setResourcesOpen(!resourcesOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-darker text-text-primary">
      <Header />
      
      <TopicForm 
        onGenerate={handleGenerateMap} 
        isLoading={isLoading}
        history={searchHistory}
        onHistorySelect={(topic, level) => handleGenerateMap(topic, level)}
      />

      
      <main className="flex-1 flex flex-col">
        {!showMap && !isLoading && !error && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-6 animate-bounce">🗺️</div>
              <h2 className="text-2xl font-bold mb-2">Start Your Learning Journey</h2>
              <p className="text-text-secondary mb-1">Enter a topic above to generate your personalized learning map.</p>
              <p className="text-sm text-gray-500">
                Choose your level and let it create a structured learning path for you.
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-lg font-semibold"> Generating your learning path...</p>
            <p className="text-sm text-gray-400">This may take a moment</p>
          </div>
        )}

        {error && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="text-5xl">⚠️</div>
            <h3 className="text-2xl font-bold text-error">Oops! Something went wrong</h3>
            <p className="text-text-secondary max-w-md">{error}</p>
            <button 
              onClick={() => {
                setShowMap(false);
                setError(null);
              }}
              className="px-6 py-2 bg-error text-white font-semibold rounded-lg shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* This is the main "Map and Resources" area */}
        {showMap && !isLoading && !error && nodes.length > 0 && (
          <div className="flex-1 flex flex-col lg:flex-row">
            
            
            <div 
              className={`printable-map-area flex-1 flex flex-col min-w-0 ${resourcesOpen && selectedNode ? 'hidden lg:flex' : 'flex'}`}
            >
              {/* Map Header */}
              <div className="map-header flex flex-col md:flex-row justify-between items-center p-4 md:p-6 bg-gradient-to-r from-card-bg/90 to-bg-dark/90 border-b border-border-color gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-tertiary text-transparent bg-clip-text">
                    {currentTopic}
                  </h2>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-secondary/20 text-secondary border border-secondary/30">
                    {currentLevel}
                  </span>
                  {isCached && (
                    <span className="hidden sm:inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-success/20 text-success border border-success/30">
                      💾 Cached
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all w-1/2 md:w-auto"
                      onClick={toggleResources}
                    >
                    {resourcesOpen ? ' Hide' : ' Show'} Resources
                  </button>
                  <ExportButton 
                    nodes={nodes} 
                    edges={edges} 
                    topic={currentTopic}
                    level={currentLevel}
                    className="w-1/2 md:w-auto"
                  />
                </div>
              </div>
              
             
              <div className="flow-wrapper flex-1 relative bg-bg-darker min-h-[50vh]">
                <LearningMap 
                  initialNodes={nodes} 
                  initialEdges={edges}
                  onNodeClick={handleNodeClick}
                />
              </div>
            </div>

            {resourcesOpen && selectedNode && (
              <ResourcePanel
                node={selectedNode}
                resources={resources[selectedNode.id] || {}}
                onClose={() => setResourcesOpen(false)}
              />
            )}
          </div>
        )}
      </main>
      <footer className="w-full text-center p-4 border-t border-border-color bg-bg-dark">
        <p className="text-sm text-text-secondary">
          LearnMap © 2025 
          <span className="mx-2">|</span>
          <a 
            href="https://github.com/prathamesonar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;