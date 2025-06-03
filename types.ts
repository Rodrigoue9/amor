
export interface Photo {
  id: string;
  url: string;
  caption?: string;
}

export interface LoveLetter {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string for date (e.g., YYYY-MM-DD)
  author?: string;
}

export interface ThemeColors {
  background: string;        // e.g., 'bg-rose-50'
  text: string;              // e.g., 'text-rose-700'
  primaryButtonBg: string;   // e.g., 'bg-rose-500'
  primaryButtonText: string; // e.g., 'text-white'
  secondaryButtonBg: string; // e.g., 'bg-rose-200'
  secondaryButtonText: string; // e.g., 'text-rose-800'
  accent: string;            // e.g., 'text-rose-600' for icons, highlights
  cardBg: string;            // e.g., 'bg-white'
  borderColor: string;       // e.g., 'border-rose-300'
  quoteText: string;         // e.g., 'text-rose-600 italic'
  headerFooterBg: string;    // e.g., 'bg-rose-100'
}

export interface SiteContent {
  photos: Photo[];
  quotes: [string, string];
  loveLetters: LoveLetter[];
}

export interface AppContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  theme: ThemeColors;
  setTheme: (newTheme: Partial<ThemeColors>) => void;
  content: SiteContent;
  addPhoto: (file: File, caption?: string) => Promise<void>; // Updated signature
  removePhoto: (photoId: string) => void;
  updatePhoto: (photoId: string, data: { file?: File; caption?: string }) => Promise<void>; // Updated signature
  updateQuote: (index: 0 | 1, text: string) => void;
  addLoveLetter: (letterData: Omit<LoveLetter, 'id'>) => void;
  updateLoveLetter: (letterId: string, letterData: Partial<Omit<LoveLetter, 'id'>>) => void;
  removeLoveLetter: (letterId: string) => void;
  adminPasswordHash: string; 
  changeAdminPassword: (newPassword: string) => Promise<boolean>;
  isLoading: boolean;
  storageError: string | null;
  clearStorageError: () => void;
}

// Simple hashing function (for demonstration, use a robust library in production)
export const simpleHash = async (password: string): Promise<string> => {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for environments without crypto.subtle (like older non-secure contexts)
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `fallback_${hash.toString()}`;
};