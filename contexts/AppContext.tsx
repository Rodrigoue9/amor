// amor teste mysql/contexts/AppContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { AppContextType, Photo, SiteContent, ThemeColors, simpleHash, LoveLetter } from '../types';
import { DEFAULT_THEME, INITIAL_ADMIN_PASSWORD, DEFAULT_QUOTES } from '../constants';

// ---- ADICIONE A URL DA SUA API AQUI ----
const API_URL = 'http://localhost/sitemidias/api.php'; // Altere se o caminho do seu projeto PHP for diferente

const AppContext = createContext<AppContextType | undefined>(undefined);

// A função readFileAsDataURL não é mais necessária para a lógica principal, mas pode ser mantida para outros usos se desejar.

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Começa como true
  const [storageError, setStorageError] = useState<string | null>(null);

  const handleStorageError = useCallback((error: Error) => {
    // ... (esta função pode ser mantida como está)
    console.error("AppContext: Erro de armazenamento detectado:", error);
    let message = "Ocorreu um erro ao salvar os dados. ";
    if (error.name === 'QuotaExceededError' || (error.message && (error.message.toLowerCase().includes('quota') || error.message.toLowerCase().includes('storage')))) {
      message += "O limite de armazenamento do navegador foi atingido. Tente remover itens antigos ou usar imagens menores.";
    } else if (error.message && error.message.includes('JSON.parse')) {
      message += "Houve um problema ao ler os dados salvos. Pode estar corrompido."
    }
    else {
      message += "Por favor, verifique o console para mais detalhes.";
    }
    setStorageError(message);
  }, []);
  
  const clearStorageError = useCallback(() => {
    setStorageError(null);
  }, []);

  const [theme, setThemeState] = useLocalStorage<ThemeColors>('loveStoryTheme', DEFAULT_THEME, handleStorageError);
  const [photos, setPhotos] = useState<Photo[]>([]); // Começa vazio, será preenchido pela API
  const [quotes, setQuotes] = useLocalStorage<[string, string]>('loveStoryQuotes', DEFAULT_QUOTES, handleStorageError);
  const [loveLetters, setLoveLetters] = useLocalStorage<LoveLetter[]>('loveStoryLoveLetters', [], handleStorageError);
  
  const [adminPasswordHash, setAdminPasswordHashLocal] = useState<string>('');
  const [rawAdminPasswordHashLS, setRawAdminPasswordHashLS] = useLocalStorage<string>('loveStoryAdminPassHash', '', handleStorageError);

  // ... (a lógica de senha pode ser mantida como está)
  useEffect(() => {
    setAdminPasswordHashLocal(rawAdminPasswordHashLS);
  }, [rawAdminPasswordHashLS]);
  const setPasswordHashAndPersist = useCallback(async (newPasswordOrHash: string, isHash: boolean = false) => {
    setIsLoading(true);
    const hashToStore = isHash ? newPasswordOrHash : await simpleHash(newPasswordOrHash);
    setAdminPasswordHashLocal(hashToStore);
    setRawAdminPasswordHashLS(hashToStore); 
    setIsLoading(false);
  }, [setRawAdminPasswordHashLS]);
  useEffect(() => {
    const initializePassword = async () => {
      if (rawAdminPasswordHashLS === '' && typeof rawAdminPasswordHashLS === 'string') {
        console.log("Initializing admin password...");
        await setPasswordHashAndPersist(INITIAL_ADMIN_PASSWORD, false);
      }
    };
    initializePassword();
  }, [rawAdminPasswordHashLS, setPasswordHashAndPersist]);


  // ---- SUBSTITUA O useEffect DE FOTOS PELA VERSÃO ABAIXO ----
  useEffect(() => {
    const fetchPhotosFromBackend = async () => {
      setIsLoading(true);
      setStorageError(null);
      console.log("Buscando fotos do backend...");
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Falha ao buscar fotos do servidor. Verifique se o XAMPP está rodando e a URL da API está correta.');
        }
        const result = await response.json();
        if (result.sucesso) {
          setPhotos(result.dados); // A API retorna os dados corretos
        } else {
          throw new Error(result.mensagem || 'Erro desconhecido na API.');
        }
      } catch (error) {
        console.error("Erro ao buscar fotos:", error);
        if (error instanceof Error) {
            setStorageError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPhotosFromBackend();
  }, []);


  const login = useCallback(async (password: string): Promise<boolean> => {
    // ... (manter a lógica de login como está)
    setIsLoading(true);
    const currentHash = await simpleHash(password);
    const storedHash = adminPasswordHash || (rawAdminPasswordHashLS === '' ? await simpleHash(INITIAL_ADMIN_PASSWORD) : adminPasswordHash);
    
    if (currentHash === storedHash) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    }
    setIsAuthenticated(false);
    setIsLoading(false);
    return false;
  }, [adminPasswordHash, rawAdminPasswordHashLS]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const setTheme = useCallback((newTheme: Partial<ThemeColors>) => {
    setThemeState(prevTheme => ({ ...prevTheme, ...newTheme }));
  }, [setThemeState]);

  // ---- SUBSTITUA A FUNÇÃO addPhoto PELA VERSÃO ABAIXO ----
  const addPhoto = useCallback(async (file: File, caption?: string): Promise<void> => {
    setIsLoading(true);
    setStorageError(null);
    console.log("Enviando foto para o backend...");
    
    const formData = new FormData();
    formData.append('image', file);
    if (caption) {
        formData.append('caption', caption);
    }

    try {
      const response = await fetch(API_URL, { 
        method: 'POST', 
        body: formData 
      });
      if (!response.ok) {
        throw new Error('Falha no envio da foto para o servidor.');
      }
      const result = await response.json();
      if (result.sucesso) {
        setPhotos(prevPhotos => [result.dados, ...prevPhotos]); // Adiciona a nova foto no início da lista
        alert('Foto adicionada com sucesso!');
      } else {
        throw new Error(result.mensagem || 'Erro desconhecido no servidor ao adicionar foto.');
      }
    } catch (error) {
      console.error("Erro ao adicionar foto:", error);
      if (error instanceof Error) {
        setStorageError(error.message);
      }
      throw error;
    } finally {
        setIsLoading(false);
    }
  }, []);

  // ---- SUBSTITUA A FUNÇÃO removePhoto PELA VERSÃO ABAIXO ----
  const removePhoto = useCallback(async (photoId: string): Promise<void> => {
    setIsLoading(true);
    setStorageError(null);
    console.log(`Removendo a foto ${photoId} do backend...`);
    
    try {
        const response = await fetch(`${API_URL}?id=${photoId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao remover a foto do servidor.');

        const result = await response.json();
        if (result.sucesso) {
            setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
            alert('Foto removida com sucesso!');
        } else {
            throw new Error(result.mensagem || 'Erro desconhecido no servidor ao remover foto.');
        }
    } catch (error) {
      console.error("Erro ao remover foto:", error);
      if (error instanceof Error) {
        setStorageError(error.message);
      }
      throw error;
    } finally {
        setIsLoading(false);
    }
  }, []);

  // A função updatePhoto seguiria uma lógica similar (enviando um POST/PUT com o ID).
  // Por enquanto, vamos focar em listar, adicionar e remover.
  const updatePhoto = useCallback(async (photoId: string, data: { file?: File, caption?: string }): Promise<void> => {
    // A implementação real iria aqui, similar ao add/remove mas usando o método PUT ou POST
    console.warn("A função de atualizar foto ainda não foi implementada com o backend real.");
    alert("Função de atualização ainda em demonstração (local).");
  }, []);
  
  // O restante do arquivo (updateQuote, loveLetters, etc.) pode ser mantido como está,
  // pois eles ainda usam o localStorage.
  const updateQuote = useCallback((index: 0 | 1, text: string) => {
    setQuotes(prevQuotes => {
      const newQuotes = [...prevQuotes] as [string, string];
      newQuotes[index] = text;
      return newQuotes;
    });
  }, [setQuotes]);
  const addLoveLetter = useCallback((letterData: Omit<LoveLetter, 'id'>) => {
    setLoveLetters(prevLetters => [...prevLetters, { ...letterData, id: Date.now().toString() }]);
  }, [setLoveLetters]);
  const updateLoveLetter = useCallback((letterId: string, letterData: Partial<Omit<LoveLetter, 'id'>>) => {
    setLoveLetters(prevLetters => prevLetters.map(letter =>
      letter.id === letterId ? { ...letter, ...letterData } : letter
    ));
  }, [setLoveLetters]);
  const removeLoveLetter = useCallback((letterId: string) => {
    setLoveLetters(prevLetters => prevLetters.filter(letter => letter.id !== letterId));
  }, [setLoveLetters]);
  const changeAdminPassword = useCallback(async (newPassword: string): Promise<boolean> => {
    if (newPassword.length < 4) { 
      setStorageError("A senha deve ter pelo menos 4 caracteres."); // Use storageError for consistency
      return false;
    }
    await setPasswordHashAndPersist(newPassword, false);
    alert("Senha alterada com sucesso!");
    return true;
  }, [setPasswordHashAndPersist]);


  const contextValue: AppContextType = {
    isAuthenticated,
    login,
    logout,
    theme,
    setTheme,
    content: { photos, quotes, loveLetters },
    addPhoto,
    removePhoto,
    updatePhoto,
    updateQuote,
    addLoveLetter,
    updateLoveLetter,
    removeLoveLetter,
    adminPasswordHash,
    changeAdminPassword,
    isLoading,
    storageError,
    clearStorageError,
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