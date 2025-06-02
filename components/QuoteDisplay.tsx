
import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const QuoteIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-12 h-12 ${className}`}>
    <path d="M6.998 4.002c-1.79 0-3.156.598-4.164 1.793S.844 8.15.844 9.94c0 2.305 1.054 4.79 3.162 7.453l.992-.992c-1.71-2.133-2.561-4.078-2.561-5.832 0-1.207.395-2.215 1.188-3.023.793-.809 1.793-1.219 2.992-1.219.89 0 1.664.25 2.32.75.656.5.984 1.219.984 2.156v8.906h5.992V4.002H6.998zm11.984 0c-1.79 0-3.156.598-4.164 1.793S12.828 8.15 12.828 9.94c0 2.305 1.054 4.79 3.162 7.453l.992-.992c-1.71-2.133-2.561-4.078-2.561-5.832 0-1.207.395-2.215 1.188-3.023.793-.809 1.793-1.219 2.992-1.219.89 0 1.664.25 2.32.75.656.5.984 1.219.984 2.156v8.906h5.992V4.002h-5.992z"/>
  </svg>
);


const QuoteDisplay: React.FC = () => {
  const { content, theme } = useAppContext();

  return (
    <div className="py-8 px-4 space-y-12 animate-gentle-fade-in">
      {content.quotes.map((quote, index) => (
        <div key={index} className={`p-6 rounded-lg shadow-xl ${theme.cardBg} ${theme.text} relative`}>
          <QuoteIcon className={`absolute top-4 left-4 opacity-10 ${theme.accent}`} />
          <QuoteIcon className={`absolute bottom-4 right-4 opacity-10 ${theme.accent} transform scale-y-[-1] scale-x-[-1]`} />
          <p className={`text-2xl leading-relaxed text-center ${theme.quoteText} font-medium`}>
            "{quote}"
          </p>
        </div>
      ))}
    </div>
  );
};

export default QuoteDisplay;
    