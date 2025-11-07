
import React, { useState } from 'react';

const TopicForm = ({ onGenerate, isLoading, history = [], onHistorySelect }) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      alert('Please enter a topic.');
      return;
    }
    onGenerate(topic, level);
    setShowHistory(false);
  };

  const handleHistoryClick = (item) => {
    onHistorySelect(item.topic, item.level);
    setShowHistory(false);
  };

  const uniqueHistory = Array.from(
    new Map(history.map(item => [`${item.topic}-${item.level}`, item])).values()
  ).slice(0, 5);

  return (
    
    <div className="bg-gradient-to-b from-card-bg/80 to-bg-dark/80 backdrop-blur-sm p-4 md:p-6 border-b border-border-color shadow-md">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto flex flex-col gap-4">
        
        {/* Input */}
        <div className="relative w-full">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What do you want to learn? (e.g., 'Machine Learning', 'Web Design')"
            disabled={isLoading}
            className="w-full p-4 pr-10 text-base md:text-lg border-2 border-border-color rounded-xl bg-bg-dark/60 text-text-primary placeholder-text-secondary transition-all duration-300
                       focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
            autoComplete="off"
            list="history-list"
          />
          {topic && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary text-2xl transition-colors"
              onClick={() => setTopic('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="level" className="font-semibold text-text-secondary">Level:</label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              disabled={isLoading}
              className="px-4 py-3 border-2 border-border-color rounded-lg bg-bg-dark/60 text-text-primary cursor-pointer transition-all duration-300
                         hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
            >
              <option value="Beginner"> Beginner</option>
              <option value="Intermediate"> Intermediate</option>
              <option value="Advanced"> Advanced</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-cyan-600 text-white text-base font-bold rounded-lg shadow-md transition-all duration-300
                       hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin-mini"></span>
                Generating...
              </>
            ) : (
              <>
                 Generate Map
              </>
            )}
          </button>
        </div>
      </form>

      {/* History */}
      {uniqueHistory.length > 0 && (
        <div className="max-w-7xl mx-auto mt-3">
          <button
            className="text-sm text-text-secondary hover:text-primary transition-colors"
            onClick={() => setShowHistory(!showHistory)}
          >
            📋 {showHistory ? 'Hide' : 'Show'} Recent Searches ({uniqueHistory.length})
          </button>

          {showHistory && (
            <div className="flex flex-wrap gap-2 mt-2">
              {uniqueHistory.map((item, idx) => (
                <button
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs transition-all
                             hover:bg-primary/20 hover:-translate-y-0.5"
                  onClick={() => handleHistoryClick(item)}
                >
                  <span className="font-medium">{item.topic}</span>
                  <span className="opacity-70">({item.level})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <datalist id="history-list">
        {history.map((item, idx) => (
          <option key={idx} value={item.topic} />
        ))}
      </datalist>
    </div>
  );
};

export default TopicForm;