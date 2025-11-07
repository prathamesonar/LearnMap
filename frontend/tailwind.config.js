/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#06b6d4',      
        secondary: '#8b5cf6',    
        tertiary: '#ec4899',     

        'bg-dark': '#ffffff',        
        'bg-darker': '#f1f5f9',     
        'text-primary': '#0f172a',   
        'text-secondary': '#475569', 
        'border-color': '#e2e8f0',   
        'card-bg': '#ffffff',        

        success: '#10b981',
        error: '#ef4444',
      },

      animation: {
        float: 'float 3s ease-in-out infinite',
        bounce: 'bounce 2s ease-in-out infinite',
        spin: 'spin 1s linear infinite',
        'spin-mini': 'spin 0.6s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}