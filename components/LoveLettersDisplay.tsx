
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { LoveLetter } from '../types';

const HeartIconSolid = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-8 h-8 inline-block ${className}`}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const LoveLettersDisplay: React.FC = () => {
  const { content, theme } = useAppContext();

  if (content.loveLetters.length === 0) {
    return (
      <div className={`py-12 px-4 text-center ${theme.cardBg} ${theme.text} rounded-lg shadow-xl my-12 animate-gentle-fade-in`}>
        <HeartIconSolid className={`${theme.accent} mb-4 mx-auto animate-pulse`} />
        <h2 className={`text-3xl font-bold mb-4 ${theme.accent}`}>Nossas Cartas de Amor</h2>
        <p className="text-xl opacity-80">Nossa coleção de cartas de amor está esperando para ser preenchida com palavras doces...</p>
        <p className="mt-2 opacity-70">Escreva algumas cartas no painel de administração para vê-las aqui!</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    // Handles potential invalid date string by checking for 'T' from ISO full string.
    // Admin panel saves as YYYY-MM-DD, so this should generally be fine.
    const datePart = dateString.includes('T') ? dateString.split('T')[0] : dateString;
    const date = new Date(datePart + 'T00:00:00'); // Ensure correct parsing regardless of local timezone for YYYY-MM-DD
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="py-12 px-4 animate-gentle-fade-in">
      <div className="text-center mb-12">
        <HeartIconSolid className={`${theme.accent} mb-3 mx-auto animate-pulse`} />
        <h2 className={`text-4xl font-bold ${theme.accent}`}>Nossas Cartas de Amor</h2>
      </div>
      <div className="space-y-8 max-w-3xl mx-auto">
        {content.loveLetters.slice().reverse().map((letter: LoveLetter) => ( // Show newest first
          <article key={letter.id} className={`${theme.cardBg} ${theme.text} p-6 rounded-xl shadow-2xl hover:shadow-rose-200/50 transition-shadow duration-300`}>
            <header className="mb-4">
              <h3 className={`text-2xl font-semibold ${theme.accent}`}>{letter.title}</h3>
              <p className={`text-sm opacity-70 mt-1`}>
                {formatDate(letter.date)}
                {letter.author && <span className="italic"> - {letter.author}</span>}
              </p>
            </header>
            <div className={`prose prose-sm sm:prose-base ${theme.text} max-w-none whitespace-pre-wrap leading-relaxed`}>
              {letter.content}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default LoveLettersDisplay;
