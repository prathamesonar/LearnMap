import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-card-bg to-bg-dark border-b-2 border-border-color shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 md:py-6 gap-4">
          
          {/* Branding */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-primary to-tertiary text-transparent bg-clip-text">
                LearnMap
              </h1>
              <p className="text-sm text-text-secondary">
                 Learning Path Generator
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="text-lg"></span>
              <span>Powered by Gemini AI</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="text-lg">⚡</span>
              <span>Instant Generation</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="text-lg">📚</span>
              <span>Rich Resources</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;