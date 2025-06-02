
import { ThemeColors } from './types';

export const TARGET_DATE = new Date('2025-03-28T00:00:00');
export const INITIAL_ADMIN_PASSWORD = 'love'; // IMPORTANTE: Mude isso em uma implantação real!

export const DEFAULT_THEME: ThemeColors = {
  background: 'bg-rose-50',
  text: 'text-rose-800',
  primaryButtonBg: 'bg-rose-500 hover:bg-rose-600',
  primaryButtonText: 'text-white',
  secondaryButtonBg: 'bg-rose-200 hover:bg-rose-300',
  secondaryButtonText: 'text-rose-800',
  accent: 'text-rose-500',
  cardBg: 'bg-white',
  borderColor: 'border-rose-200',
  quoteText: 'text-rose-600 italic',
  headerFooterBg: 'bg-rose-100',
};

// Available color options for theme editor
export const THEME_COLOR_OPTIONS = {
  backgrounds: ['bg-rose-50', 'bg-pink-50', 'bg-purple-50', 'bg-indigo-50', 'bg-sky-50', 'bg-teal-50', 'bg-gray-100'],
  texts: ['text-rose-800', 'text-pink-800', 'text-purple-800', 'text-indigo-800', 'text-sky-800', 'text-teal-800', 'text-gray-700'],
  primaryButtonBgs: ['bg-rose-500 hover:bg-rose-600', 'bg-pink-500 hover:bg-pink-600', 'bg-purple-500 hover:bg-purple-600', 'bg-indigo-500 hover:bg-indigo-600'],
  primaryButtonTexts: ['text-white', 'text-gray-100'],
  accents: ['text-rose-500', 'text-pink-500', 'text-purple-500', 'text-indigo-500', 'text-sky-600', 'text-teal-600'],
  cardBgs: ['bg-white', 'bg-rose-100', 'bg-pink-100', 'bg-purple-100'],
  borderColors: ['border-rose-200', 'border-pink-200', 'border-purple-200', 'border-indigo-200'],
  headerFooterBgs: ['bg-rose-100', 'bg-pink-100', 'bg-purple-100', 'bg-indigo-100'],
};

export const DEFAULT_QUOTES: [string, string] = [
  "Toda história de amor é linda, mas a nossa é a minha favorita.",
  "Juntos é um lugar maravilhoso para estar."
];

export const THEME_PROPERTY_TRANSLATIONS: Record<keyof ThemeColors, string> = {
  background: "Cor de Fundo",
  text: "Cor do Texto",
  primaryButtonBg: "Fundo do Botão Primário",
  primaryButtonText: "Texto do Botão Primário",
  secondaryButtonBg: "Fundo do Botão Secundário",
  secondaryButtonText: "Texto do Botão Secundário",
  accent: "Cor de Destaque",
  cardBg: "Fundo do Cartão",
  borderColor: "Cor da Borda",
  quoteText: "Cor do Texto da Citação",
  headerFooterBg: "Fundo do Cabeçalho/Rodapé",
};
