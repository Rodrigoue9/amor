
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { AppContextType, Photo, SiteContent, ThemeColors, simpleHash } from '../types';
import { DEFAULT_THEME, INITIAL_ADMIN_PASSWORD, DEFAULT_QUOTES } from '../constants';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [theme, setThemeState] = useLocalStorage<ThemeColors>('loveStoryTheme', DEFAULT_THEME);
  const [photos, setPhotos] = useLocalStorage<Photo[]>('loveStoryPhotos', []);
  const [quotes, setQuotes] = useLocalStorage<[string, string]>('loveStoryQuotes', DEFAULT_QUOTES);
  const [adminPasswordHash, setAdminPasswordHash] = useLocalStorage<string>('loveStoryAdminPassHash', '');

  // Initialize admin password hash if not set
  useEffect(() => {
    const initializePassword = async () => {
      if (!adminPasswordHash) {
        const initialHash = await simpleHash(INITIAL_ADMIN_PASSWORD);
        setAdminPasswordHash(initialHash);
      }
    };
    initializePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const login = useCallback(async (password: string): Promise<boolean> => {
    setIsLoading(true);
    const currentHash = await simpleHash(password);
    // Ensure adminPasswordHash is loaded before comparing
    const storedHash = adminPasswordHash || (await simpleHash(INITIAL_ADMIN_PASSWORD));
    if (currentHash === storedHash) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    }
    setIsAuthenticated(false);
    setIsLoading(false);
    return false;
  }, [adminPasswordHash]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const setTheme = useCallback((newTheme: Partial<ThemeColors>) => {
    setThemeState(prevTheme => ({ ...prevTheme, ...newTheme }));
  }, [setThemeState]);

  const addPhoto = useCallback((photoData: Omit<Photo, 'id'>) => {
    setPhotos(prevPhotos => [...prevPhotos, { ...photoData, id: Date.now().toString() }]);
  }, [setPhotos]);

  const removePhoto = useCallback((photoId: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
  }, [setPhotos]);

  const updatePhoto = useCallback((photoId: string, newUrl: string, newCaption?: string) => {
    setPhotos(prevPhotos => prevPhotos.map(photo => 
      photo.id === photoId ? { ...photo, url: newUrl, caption: newCaption || photo.caption } : photo
    ));
  }, [setPhotos]);
  
  const updateQuote = useCallback((index: 0 | 1, text: string) => {
    setQuotes(prevQuotes => {
      const newQuotes = [...prevQuotes] as [string, string];
      newQuotes[index] = text;
      return newQuotes;
    });
  }, [setQuotes]);

  const changeAdminPassword = useCallback(async (newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    if (newPassword.length < 4) { // Basic validation
      setIsLoading(false);
      alert("A senha deve ter pelo menos 4 caracteres.");
      return false;
    }
    const newHash = await simpleHash(newPassword);
    setAdminPasswordHash(newHash);
    setIsLoading(false);
    alert("Senha alterada com sucesso!");
    return true;
  }, [setAdminPasswordHash]);

  const contextValue: AppContextType = {
    isAuthenticated,
    login,
    logout,
    theme,
    setTheme,
    content: { photos, quotes },
    addPhoto,
    removePhoto,
    updatePhoto,
    updateQuote,
    adminPasswordHash, 
    changeAdminPassword,
    isLoading,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext deve ser usado dentro de um AppContextProvider');
  }
  return context;
};
