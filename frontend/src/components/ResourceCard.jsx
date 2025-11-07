import React from 'react';

const ResourceCard = ({ resource, type, variant = 'default' }) => {
  const isCompact = variant === 'compact';

  // Define icons for compact view
  const icons = {
    articles: '📄',
    videos: '📺',
    books: '📚',
    courses: '🎓',
  };

  const renderContent = () => {
    switch (type) {
      case 'articles':
        return (
          <div className="flex-1 flex flex-col">
            {!isCompact && (
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-primary/20 text-primary border border-primary/30">{resource.source}</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-secondary/20 text-secondary border border-secondary/30">{resource.difficulty}</span>
              </div>
            )}
            <h3 className="font-bold text-text-primary leading-snug">{resource.title}</h3>
            {!isCompact && <p className="text-sm text-text-secondary mt-1 line-clamp-2">{resource.description}</p>}
            {!isCompact && <div className="mt-auto pt-2 text-xs text-text-secondary">📖 {resource.readTime}</div>}
          </div>
        );

      case 'videos':
        return (
          <div className="flex-1 flex flex-col">
            {!isCompact && (
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-tertiary/20 text-tertiary border border-tertiary/30">{resource.channel}</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-tertiary/20 text-tertiary border border-tertiary/30">⏱️ {resource.duration}</span>
              </div>
            )}
            <h3 className="font-bold text-text-primary leading-snug">{resource.title}</h3>
            {!isCompact && <p className="text-sm text-text-secondary mt-1 line-clamp-2">{resource.description}</p>}
            {!isCompact && <div className="mt-auto pt-2 text-xs text-text-secondary">{resource.source}</div>}
          </div>
        );

      case 'books':
        return (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-bold text-text-primary leading-snug flex-1">{resource.title}</h3>
              {!isCompact && (
                <div className="flex-shrink-0 text-xs text-yellow-400 font-bold">
                  ⭐ {resource.rating}
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-primary mt-0.5">{resource.author}</p>
            {!isCompact && <p className="text-xs text-text-secondary mt-1">📅 {resource.year}</p>}
            {!isCompact && <p className="text-sm text-text-secondary mt-1 line-clamp-2">{resource.description}</p>}
          </div>
        );

      case 'courses':
        return (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-bold text-text-primary leading-snug flex-1">{resource.title}</h3>
              <div className="flex-shrink-0 text-sm font-bold text-success">{resource.price}</div>
            </div>
            {!isCompact && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-success/20 text-success border border-success/30">🏢 {resource.platform}</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-success/20 text-success border border-success/30">⭐ {resource.rating}</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-success/20 text-success border border-success/30">👥 {resource.students}</span>
              </div>
            )}
            {!isCompact && <p className="text-sm text-text-secondary mt-1 line-clamp-2">{resource.description}</p>}
          </div>
        );

      default:
        return <p>{resource.description}</p>;
    }
  };

  const cardClasses = `resource-card group relative flex p-4 bg-gradient-to-r from-card-bg/80 to-bg-dark/80 border border-border-color 
                     rounded-lg transition-all duration-300 no-underline
                     hover:border-primary hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/20`;

  return (
    <a 
      href={resource.url || '#'} 
      target="_blank"
      rel="noopener noreferrer"
      className={`${cardClasses} ${isCompact ? 'items-center gap-3' : 'flex-col'}`}
      title={`Open resource: ${resource.title}`}
    >
      {isCompact && <span className="text-2xl">{icons[type]}</span>}
      
      {renderContent()}
      
      {!isCompact && (
        <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
          <span className="text-sm font-semibold text-primary/80 transition-all
                         group-hover:text-primary group-hover:translate-x-1">
            Visit →
          </span>
        </div>
      )}
    </a>
  );
};

export default ResourceCard;