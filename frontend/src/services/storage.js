const STORAGE_KEY = 'learnmap_history';
const MAX_HISTORY_ITEMS = 20;


export const loadSearchHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Error loading search history:', error);
    return [];
  }
};


export const saveToHistory = (topic, level) => {
  try {
    const history = loadSearchHistory();
    
    const newItem = {
      topic: topic.trim(),
      level,
      timestamp: Date.now()
    };

    // Remove duplicates and keep most recent
    const filtered = history.filter(
      item => !(item.topic === newItem.topic && item.level === newItem.level)
    );

    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.warn('Error saving to history:', error);
    return [];
  }
};


export const clearHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (error) {
    console.warn('Error clearing history:', error);
  }
};


export const exportDataToJSON = (data, filename = 'learnmap-data.json') => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
};