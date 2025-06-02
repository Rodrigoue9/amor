
import React, { useState, useEffect } from 'react';
import { TARGET_DATE } from '../constants';
import { useAppContext } from '../contexts/AppContext';

const HeartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-8 h-8 inline-block ${className}`}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const DayCounter: React.FC = () => {
  const { theme } = useAppContext();
  const [days, setDays] = useState(0);

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date();
      const differenceInTime = now.getTime() - TARGET_DATE.getTime();
      const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
      setDays(differenceInDays >= 0 ? differenceInDays : 0); // Mostrar 0 se a data alvo for no futuro
    };

    calculateDays();
    const intervalId = setInterval(calculateDays, 1000 * 60 * 60); // Atualizar a cada hora

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`py-8 px-4 text-center ${theme.cardBg} shadow-xl rounded-xl animate-gentle-fade-in my-8 mx-auto max-w-md`}>
      <HeartIcon className={`${theme.accent} mb-3 animate-pulse`} />
      <p className={`text-xl ${theme.text} mb-2`}>Estamos compartilhando nosso amor por</p>
      <p className={`text-6xl font-bold ${theme.accent}`}>{days}</p>
      <p className={`text-xl ${theme.text} mt-2`}>{days === 1 ? 'dia mágico' : 'dias mágicos'}</p>
      <p className={`text-sm ${theme.text} opacity-70 mt-4`}>Desde {TARGET_DATE.toLocaleDateString('pt-BR')}</p>
    </div>
  );
};

export default DayCounter;
