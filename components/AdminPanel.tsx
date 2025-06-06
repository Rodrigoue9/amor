
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useAppContext } from '../contexts/AppContext';
import { Photo, ThemeColors, LoveLetter } from '../types';
import { THEME_COLOR_OPTIONS, DEFAULT_THEME, THEME_PROPERTY_TRANSLATIONS } from '../constants';

// Helper Icons (embedding for brevity)
const EyeIcon = ({ className }: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const EyeSlashIcon = ({ className }: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228" /></svg>;
const ArrowPathIcon = ({ className }: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;
const PhotoIcon = ({ className }: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.225.225 0 1 1-.45 0 .225.225 0 0 1 .45 0Z" /></svg>;
const PencilSquareIcon = ({ className }: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const PaintBrushIcon = ({ className }: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-2.122.908L6.05 18.37a1.5 1.5 0 0 0-.264 1.069l.06.579a2.25 2.25 0 0 0 1.186 1.803l3.005 1.502a3 3 0 0 0 3.329 0l3.005-1.502a2.25 2.25 0 0 0 1.186-1.803l.06-.579a1.5 1.5 0 0 0-.264-1.069l-1.343-1.342a3 3 0 0 0-2.122-.908M12 8.25V4.5m0 3.75a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3Zm9 0a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3Z" /></svg>;
const TrashIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.24.03 3.22.078l7.223 7.223M3.328 5.778c.099-.058.2-.112.303-.162m2.004 0A23.977 23.977 0 0 1 12 5.5c4.634 0 8.939.814 12.672 2.278m0 0a3.242 3.242 0 0 1-.306.162M5.33 5.616a23.977 23.977 0 0 0-2.004 0M18 9h-6" /></svg>;
const ArrowUpTrayIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>;
const HomeIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const EnvelopeIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>;
const PlusCircleIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const PencilIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>;
const ExclamationTriangleIcon = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>;


type AdminSection = 'dashboard' | 'theme' | 'photos' | 'quotes' | 'loveLetters' | 'password';

const AdminPanel: React.FC = () => {
  const {
    isAuthenticated,
    login,
    logout,
    theme,
    setTheme,
    content,
    addPhoto,
    removePhoto,
    updatePhoto,
    updateQuote,
    addLoveLetter,
    updateLoveLetter,
    removeLoveLetter,
    changeAdminPassword,
    isLoading,
    storageError,
    clearStorageError,
  } = useAppContext();

  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentSection, setCurrentSection] = useState<AdminSection>('dashboard');
  const [isReadingFile, setIsReadingFile] = useState(false);


  // States for Photo forms
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null); // Store the File object
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null); // For local preview only
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  // States for Quote forms
  const [quote1, setQuote1] = useState(content.quotes[0]);
  const [quote2, setQuote2] = useState(content.quotes[1]);

  // States for Love Letter forms
  const [editingLetter, setEditingLetter] = useState<LoveLetter | null>(null);
  const [letterTitle, setLetterTitle] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [letterDate, setLetterDate] = useState(new Date().toISOString().split('T')[0]); 
  const [letterAuthor, setLetterAuthor] = useState('');


  // States for Password form
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmNewAdminPassword, setConfirmNewAdminPassword] = useState('');


  useEffect(() => {
    setQuote1(content.quotes[0]);
    setQuote2(content.quotes[1]);
  }, [content.quotes]);

  const resetPhotoForm = () => {
    setNewPhotoFile(null);
    setNewPhotoPreview(null);
    setNewPhotoCaption('');
    setEditingPhoto(null);
    const photoFileInput = document.getElementById('photoFile') as HTMLInputElement;
    if (photoFileInput) photoFileInput.value = ''; 
  };
  
  const resetLetterForm = () => {
    setEditingLetter(null);
    setLetterTitle('');
    setLetterContent('');
    setLetterDate(new Date().toISOString().split('T')[0]);
    setLetterAuthor('');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
       // Basic client-side size check, actual limits would be on the server
      if (file.size > 10 * 1024 * 1024) { // Example: 10MB client-side warning
        alert("A imagem é muito grande (máx ~10MB para demonstração). Servidores reais podem ter outros limites.");
        setNewPhotoFile(null);
        setNewPhotoPreview(null);
        e.target.value = ''; 
        return;
      }
      setNewPhotoFile(file); // Store the File object
      
      // Generate local preview
      const reader = new FileReader();
      reader.onloadstart = () => setIsReadingFile(true);
      reader.onloadend = () => {
        setNewPhotoPreview(reader.result as string);
        setIsReadingFile(false);
      };
      reader.onerror = () => {
        console.error("Erro ao ler o arquivo de imagem para pré-visualização.");
        alert("Ocorreu um erro ao ler o arquivo de imagem para pré-visualização.");
        setIsReadingFile(false);
        setNewPhotoFile(null);
        setNewPhotoPreview(null);
        e.target.value = '';
      }
      reader.readAsDataURL(file);
    } else {
      setNewPhotoFile(null);
      setNewPhotoPreview(null);
      if (editingPhoto) { // If was editing, restore preview from existing photo URL
        setNewPhotoPreview(editingPhoto.url);
      }
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(password);
    if (!success) {
      setError('Senha inválida. Por favor, tente novamente.');
    } else {
      setPassword(''); 
    }
  };

  const handleAddPhoto = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPhotoFile) { // Check for the File object
      alert('Por favor, selecione um arquivo de imagem.');
      return;
    }
    try {
      await addPhoto(newPhotoFile, newPhotoCaption); // Pass the File object
      // Alert message updated by addPhoto in context
      resetPhotoForm();
    } catch (err) {
      console.error("Falha ao tentar adicionar foto:", err);
      // Error already handled by context's setStorageError
    }
  };

  const handleEditPhotoClick = (photo: Photo) => {
    setCurrentSection('photos');
    setEditingPhoto(photo);
    setNewPhotoCaption(photo.caption || '');
    setNewPhotoPreview(photo.url); // Set preview from existing URL
    setNewPhotoFile(null); // Clear any selected file initially
    const photoFileInput = document.getElementById('photoFile') as HTMLInputElement;
    if (photoFileInput) photoFileInput.value = '';
    window.scrollTo(0,0);
  };
  
  const handleUpdatePhoto = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    try {
      // Pass the File object if a new one is selected, or undefined otherwise
      await updatePhoto(editingPhoto.id, { file: newPhotoFile || undefined, caption: newPhotoCaption });
      // Alert message updated by updatePhoto in context
      resetPhotoForm();
    } catch (err) {
      console.error("Falha ao tentar atualizar foto:", err);
      // Error already handled by context's setStorageError
    }
  };


  const handleSaveQuotes = () => {
    updateQuote(0, quote1);
    updateQuote(1, quote2);
    alert('Citações salvas!');
  };

  const handleAddOrUpdateLetter = (e: FormEvent) => {
    e.preventDefault();
    if (!letterTitle.trim() || !letterContent.trim() || !letterDate.trim()) {
        alert('Por favor, preencha o título, conteúdo e data da carta.');
        return;
    }
    const letterData = { 
        title: letterTitle, 
        content: letterContent, 
        date: letterDate, 
        author: letterAuthor.trim() || undefined 
    };

    if (editingLetter) {
        updateLoveLetter(editingLetter.id, letterData);
        alert('Carta atualizada com sucesso!');
    } else {
        addLoveLetter(letterData);
        alert('Carta adicionada com sucesso!');
    }
    resetLetterForm();
  };

  const handleEditLetterClick = (letter: LoveLetter) => {
    setCurrentSection('loveLetters');
    setEditingLetter(letter);
    setLetterTitle(letter.title);
    setLetterContent(letter.content);
    setLetterDate(letter.date); 
    setLetterAuthor(letter.author || '');
    window.scrollTo(0,0);
  };

  const handleDeleteLetter = (letterId: string) => {
    if (confirm('Tem certeza que deseja remover esta carta de amor?')) {
        removeLoveLetter(letterId);
        alert('Carta removida.');
    }
  };
  
  const handleDeletePhoto = async (photoId: string) => {
    if (confirm('Tem certeza que deseja remover esta foto? Esta ação (simulada) tentaria remover do servidor.')) {
        try {
            await removePhoto(photoId);
            // Alert is handled by removePhoto in context
        } catch (err) {
            console.error("Falha ao tentar remover foto:", err);
             // Error already handled by context's setStorageError
        }
    }
  };


  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (newAdminPassword !== confirmNewAdminPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    if (newAdminPassword.length < 4) {
      alert('A senha deve ter pelo menos 4 caracteres.'); // This alert is fine here
      return;
    }
    const success = await changeAdminPassword(newAdminPassword);
    if (success) {
      setNewAdminPassword('');
      setConfirmNewAdminPassword('');
      // Alert handled by changeAdminPassword
    }
    // If !success, changeAdminPassword should set storageError
  };

  const handleThemeChange = (prop: keyof ThemeColors, value: string) => {
    setTheme({ [prop]: value });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${theme.background} ${theme.text}`}>
        <div className={`${theme.cardBg} p-8 rounded-xl shadow-2xl w-full max-w-md text-center`}>
          <h1 className={`text-3xl font-bold mb-6 ${theme.accent}`}>Login do Administrador</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Digite a Senha do Administrador"
                className={`w-full p-3 rounded-lg ${theme.borderColor} border bg-transparent focus:ring-2 ${theme.accent.replace('text-', 'ring-')} focus:border-transparent outline-none transition`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute inset-y-0 right-0 px-3 flex items-center ${theme.text} opacity-70 hover:opacity-100`}>
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isLoading || isReadingFile}
              className={`w-full p-3 rounded-lg ${theme.primaryButtonBg} ${theme.primaryButtonText} font-semibold transition hover:opacity-90 disabled:opacity-50`}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
        <p className="mt-8 text-sm opacity-70">A senha padrão é 'love' (altere no Painel do Administrador).</p>
      </div>
    );
  }

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <div>
            <h2 className={`text-3xl font-semibold mb-6 ${theme.accent}`}>Bem-vindos, Pombinhos!</h2>
            <p className="mb-6">Este é o seu painel de administração especial. Gerencie o conteúdo e a aparência do seu site por aqui.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setCurrentSection('theme')} className={`p-4 rounded-lg ${theme.secondaryButtonBg} ${theme.secondaryButtonText} text-left hover:shadow-md transition flex items-center`}>
                    <PaintBrushIcon className="inline-block mr-2 w-6 h-6" /> Personalizar Aparência
                </button>
                <button onClick={() => setCurrentSection('photos')} className={`p-4 rounded-lg ${theme.secondaryButtonBg} ${theme.secondaryButtonText} text-left hover:shadow-md transition flex items-center`}>
                    <PhotoIcon className="inline-block mr-2 w-6 h-6" /> Gerenciar Galeria de Fotos
                </button>
                <button onClick={() => setCurrentSection('quotes')} className={`p-4 rounded-lg ${theme.secondaryButtonBg} ${theme.secondaryButtonText} text-left hover:shadow-md transition flex items-center`}>
                    <PencilSquareIcon className="inline-block mr-2 w-6 h-6" /> Editar Citações Afetuosas
                </button>
                <button onClick={() => setCurrentSection('loveLetters')} className={`p-4 rounded-lg ${theme.secondaryButtonBg} ${theme.secondaryButtonText} text-left hover:shadow-md transition flex items-center`}>
                    <EnvelopeIcon className="inline-block mr-2 w-6 h-6" /> Gerenciar Cartas de Amor
                </button>
                <button onClick={() => setCurrentSection('password')} className={`p-4 rounded-lg ${theme.secondaryButtonBg} ${theme.secondaryButtonText} text-left hover:shadow-md transition flex items-center`}>
                    <ArrowPathIcon className="inline-block mr-2 w-6 h-6" /> Alterar Senha do Administrador
                </button>
            </div>
          </div>
        );
      case 'theme':
        return (
          <div>
            <h2 className={`text-2xl font-semibold mb-4 ${theme.accent}`}>Personalizar Aparência</h2>
            <div className="space-y-4">
              {(Object.keys(DEFAULT_THEME) as Array<keyof ThemeColors>).map((key) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium capitalize mb-1">
                    {THEME_PROPERTY_TRANSLATIONS[key] || key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <select
                    id={key}
                    value={theme[key]}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleThemeChange(key, e.target.value)}
                    className={`w-full p-2 border ${theme.borderColor} rounded-md ${theme.cardBg} focus:ring-1 ${theme.accent.replace('text-', 'ring-')}`}
                  >
                    {THEME_COLOR_OPTIONS[key as keyof typeof THEME_COLOR_OPTIONS]?.map((option: string) => (
                      <option key={option} value={option}>{option.replace(/bg-|text-|border-/, '').replace(/-[0-9]+$/, '')}</option>
                    )) || <option value={theme[key]}>Atual: {theme[key]}</option>}
                  </select>
                </div>
              ))}
            </div>
             <button onClick={() => alert('As configurações do tema são salvas automaticamente!')} className={`mt-6 py-2 px-4 rounded ${theme.primaryButtonBg} ${theme.primaryButtonText} transition`}>Salvar Tema (Salva automaticamente)</button>
          </div>
        );
      case 'photos':
        return (
          <div>
            <h2 className={`text-2xl font-semibold mb-4 ${theme.accent}`}>{editingPhoto ? 'Editar Foto' : 'Adicionar Nova Foto (Simulado)'}</h2>
             <p className={`${theme.text} text-sm mb-4 p-3 ${theme.cardBg} border ${theme.borderColor} rounded-md`}>
                <ExclamationTriangleIcon className="inline w-5 h-5 mr-2 text-yellow-500" />
                <strong>Nota:</strong> O upload de fotos agora está preparado para um backend. As fotos adicionadas aqui aparecerão <strong>apenas localmente e temporariamente</strong> para demonstração. Elas não serão salvas permanentemente sem um servidor e banco de dados SQL.
            </p>
            <form onSubmit={editingPhoto ? handleUpdatePhoto : handleAddPhoto} className={`mb-6 p-6 border ${theme.borderColor} rounded-lg shadow-md space-y-4 ${theme.cardBg}`}>
              <div>
                <label htmlFor="photoFile" className={`block text-sm font-medium ${theme.text} mb-1`}>
                  Selecionar Imagem (arquivo será enviado ao servidor)
                </label>
                <input
                  type="file"
                  id="photoFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`w-full p-2 border ${theme.borderColor} rounded-md ${theme.text} ${theme.cardBg.replace('bg-','bg-opacity-50 ')} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold ${theme.secondaryButtonBg} ${theme.secondaryButtonText} hover:file:opacity-80`}
                />
              </div>

              {(newPhotoPreview || isReadingFile) && (
                <div className="my-2">
                  <p className={`text-sm ${theme.text} mb-1`}>Pré-visualização Local:</p>
                  {isReadingFile && <p className={`${theme.text} italic`}>Carregando pré-visualização...</p>}
                  {newPhotoPreview && !isReadingFile && <img src={newPhotoPreview} alt="Pré-visualização da foto" className="max-w-xs max-h-48 rounded-md border object-contain shadow-sm"/>}
                </div>
              )}
              
              <div>
                <label htmlFor="photoCaption" className={`block text-sm font-medium ${theme.text} mb-1`}>
                  Legenda (Opcional)
                </label>
                <input
                  type="text"
                  id="photoCaption"
                  value={newPhotoCaption}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPhotoCaption(e.target.value)}
                  placeholder="Ex: Nosso primeiro encontro"
                  className={`w-full p-2 border ${theme.borderColor} rounded-md ${theme.cardBg} focus:ring-1 ${theme.accent.replace('text-', 'ring-')} ${theme.text}`}
                />
              </div>
              
              <div className="flex space-x-3">
                <button type="submit" className={`py-2 px-5 rounded ${theme.primaryButtonBg} ${theme.primaryButtonText} transition flex items-center justify-center disabled:opacity-60`} disabled={isLoading || isReadingFile || (editingPhoto === null && !newPhotoFile) }>
                  <ArrowUpTrayIcon className="w-5 h-5 mr-2"/>
                  {editingPhoto ? 'Atualizar Foto (Simulado)' : 'Adicionar Foto (Simulado)'}
                </button>
                {editingPhoto && (
                  <button type="button" onClick={resetPhotoForm} className={`py-2 px-4 rounded ${theme.secondaryButtonBg} ${theme.secondaryButtonText} transition`}>
                    Cancelar Edição
                  </button>
                )}
              </div>
            </form>

            <h3 className={`text-xl font-semibold mt-8 mb-4 ${theme.accent}`}>Fotos Adicionadas (Em memória)</h3>
            {content.photos.length === 0 ? (
                <p className={`${theme.text}`}>Nenhuma foto adicionada ainda ou carregada do backend (simulado).</p>
            ) : (
                <div className="space-y-3">
                {content.photos.map(photo => (
                    <div key={photo.id} className={`flex items-center justify-between p-3 border ${theme.borderColor} rounded-lg ${theme.cardBg} shadow-sm`}>
                    <img src={photo.url} alt={photo.caption || 'Foto da galeria'} className="w-20 h-20 object-cover rounded-md mr-4 border"/>
                    <span className={`flex-grow truncate ${theme.text}`} title={photo.caption || photo.id}>{photo.caption || 'Sem legenda'}</span>
                    <div className="flex-shrink-0 space-x-2">
                        <button onClick={() => handleEditPhotoClick(photo)} className={`p-2 rounded-md ${theme.secondaryButtonBg} ${theme.secondaryButtonText} hover:opacity-80`} aria-label="Editar foto">
                            <PencilIcon className="w-5 h-5"/>
                        </button>
                        <button onClick={() => handleDeletePhoto(photo.id)} className={`p-2 rounded-md ${theme.secondaryButtonBg} text-red-500 hover:bg-red-100 hover:text-red-700`} aria-label="Remover foto">
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </div>
        );
      case 'quotes':
        return (
          <div>
            <h2 className={`text-2xl font-semibold mb-4 ${theme.accent}`}>Editar Citações Afetuosas</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="quote1" className="block text-sm font-medium mb-1">Citação 1</label>
                <textarea
                  id="quote1"
                  value={quote1}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setQuote1(e.target.value)}
                  rows={3}
                  className={`w-full p-2 border ${theme.borderColor} rounded-md ${theme.cardBg} focus:ring-1 ${theme.accent.replace('text-', 'ring-')}`}
                />
              </div>
              <div>
                <label htmlFor="quote2" className="block text-sm font-medium mb-1">Citação 2</label>
                <textarea
                  id="quote2"
                  value={quote2}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setQuote2(e.target.value)}
                  rows={3}
                  className={`w-full p-2 border ${theme.borderColor} rounded-md ${theme.cardBg} focus:ring-1 ${theme.accent.replace('text-', 'ring-')}`}
                />
              </div>
              <button onClick={handleSaveQuotes}  className={`py-2 px-4 rounded ${theme.primaryButtonBg} ${theme.primaryButtonText} transition`}>Salvar Citações</button>
            </div>
          </div>
        );
      case 'loveLetters':
        return (
          <div>
            <h2 className={`text-2xl font-semibold mb-4 ${theme.accent}`}>{editingLetter ? 'Editar Carta de Amor' : 'Adicionar Nova Carta de Amor'}</h2>
            <form onSubmit={handleAddOrUpdateLetter} className={`mb-6 p-6 border ${theme.borderColor} rounded-lg shadow-md space-y-4 ${theme.cardBg}`}>
              <div>
                <label htmlFor="letterTitle" className={`block text-sm font-medium ${theme.text} mb-1`}>Título da Carta</label>
                <input
                  type="text"
                  id="letterTitle"
                  value={letterTitle}
                  onChange={(e) => setLetterTitle(e.target.value)}
                  placeholder="Ex: Para Meu Amor Eterno"
                  className={`w-full p-2 border ${theme.borderColor} rounded-md ${theme.cardBg} focus:ring-1 ${theme.accent.replace('text-', 'ring-')} ${theme.text}`}
                  required
                />
              </div>
              <div>
                <label htmlFor="letterContent" className={`block text-sm font-medium ${theme.text} mb-1`}>Conteúdo da Carta</label>
                <textarea
                  id="letterContent"
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  rows={8}
                  placeholder="Escreva seus sentimentos aqui..."
                  className={`w-full p-2 border ${theme.borderColor} rounded-md ${theme.cardBg} focus:ring-1 ${theme.accent.replace('text-', 'ring-')} ${theme.text}`}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="letterDate" className={`block text-sm font-medium ${theme.text} mb-1`}>Data</label>
                  <input
                    type="date"
                    id="letterDate"
                    value={letterDate}
                    onChange={(e) => setLetterDate(e.target.value)}
                    className={`w-full p-2 border ${theme.borderColor} rounded-md ${theme.cardBg} focus:ring-1 ${theme.accent.replace('text-', 'ring-')} ${theme.text}`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="letterAuthor" className={`block text-sm font-medium ${theme.text} mb-1`}>Autor/Assinatura (Opcional)</label>
                  <input
                    type="text"
                    id="letterAuthor"
                    value={letterAuthor}
                    onChange={(e) => setLetterAuthor(e.target.value)}
                    placeholder="Ex: Com todo meu amor, [Seu Nome]"
                    className={`w-full p-2 border ${theme.borderColor} rounded-md ${theme.cardBg} focus:ring-1 ${theme.accent.replace('text-', 'ring-')} ${theme.text}`}
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className={`py-2 px-5 rounded ${theme.primaryButtonBg} ${theme.primaryButtonText} transition flex items-center justify-center disabled:opacity-60`} disabled={isLoading || isReadingFile}>
                   {editingLetter ? <PencilIcon className="w-5 h-5 mr-2"/> : <PlusCircleIcon className="w-5 h-5 mr-2"/>}
                  {editingLetter ? 'Atualizar Carta' : 'Adicionar Carta'}
                </button>
                {editingLetter && (
                  <button type="button" onClick={resetLetterForm} className={`py-2 px-4 rounded ${theme.secondaryButtonBg} ${theme.secondaryButtonText} transition`}>
                    Cancelar Edição
                  </button>
                )}
              </div>
            </form>

            <h3 className={`text-xl font-semibold mt-8 mb-4 ${theme.accent}`}>Cartas Adicionadas</h3>
            {content.loveLetters.length === 0 ? (
              <p className={`${theme.text}`}>Nenhuma carta de amor adicionada ainda.</p>
            ) : (
              <div className="space-y-3">
                {content.loveLetters.slice().reverse().map(letter => ( 
                  <div key={letter.id} className={`flex items-center justify-between p-3 border ${theme.borderColor} rounded-lg ${theme.cardBg} shadow-sm`}>
                    <div className="flex-grow overflow-hidden">
                        <h4 className={`font-semibold ${theme.accent}`}>{letter.title}</h4>
                        <p className={`text-xs opacity-70 ${theme.text}`}>{new Date(letter.date + 'T00:00:00').toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })} {letter.author && ` - ${letter.author}`}</p>
                        <p className={`text-sm mt-1 truncate ${theme.text}`} title={letter.content}>{letter.content}</p>
                    </div>
                    <div className="flex-shrink-0 space-x-2 ml-4">
                      <button onClick={() => handleEditLetterClick(letter)} className={`p-2 rounded-md ${theme.secondaryButtonBg} ${theme.secondaryButtonText} hover:opacity-80`} aria-label="Editar carta">
                        <PencilIcon className="w-5 h-5"/>
                      </button>
                      <button onClick={() => handleDeleteLetter(letter.id)} className={`p-2 rounded-md ${theme.secondaryButtonBg} text-red-500 hover:bg-red-100 hover:text-red-700`} aria-label="Remover carta">
                        <TrashIcon className="w-5 h-5"/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'password':
        return (
          <div>
            <h2 className={`text-2xl font-semibold mb-4 ${theme.accent}`}>Alterar Senha do Administrador</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="newPassword">Nova Senha (mín. 4 caracteres)</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newAdminPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewAdminPassword(e.target.value)}
                  className={`w-full p-2 border ${theme.borderColor} rounded-md ${theme.cardBg} focus:ring-1 ${theme.accent.replace('text-', 'ring-')}`}
                />
              </div>
              <div>
                <label htmlFor="confirmNewPassword">Confirmar Nova Senha</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewAdminPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmNewAdminPassword(e.target.value)}
                  className={`w-full p-2 border ${theme.borderColor} rounded-md ${theme.cardBg} focus:ring-1 ${theme.accent.replace('text-', 'ring-')}`}
                />
              </div>
              <button type="submit" disabled={isLoading || isReadingFile} className={`py-2 px-4 rounded ${theme.primaryButtonBg} ${theme.primaryButtonText} transition disabled:opacity-50`}>
                {isLoading ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </form>
          </div>
        );
      default:
        return <div>Selecione uma seção</div>;
    }
  };
  
  const navItems : {
    label: string;
    section: AdminSection;
    icon: React.ReactElement<{ className?: string }>; 
  }[] = [
    {label: "Painel", section: "dashboard", icon: <PhotoIcon />}, 
    {label: "Aparência", section: "theme", icon: <PaintBrushIcon />},
    {label: "Fotos", section: "photos", icon: <PhotoIcon />},
    {label: "Citações", section: "quotes", icon: <PencilSquareIcon />},
    {label: "Cartas de Amor", section: "loveLetters", icon: <EnvelopeIcon />},
    {label: "Senha", section: "password", icon: <ArrowPathIcon />},
  ];

  return (
    <div className={`min-h-screen flex ${theme.background} ${theme.text}`}>
      <nav className={`w-64 p-5 space-y-2 ${theme.headerFooterBg} shadow-lg flex flex-col`}>
        <div>
            <h1 className={`text-2xl font-bold mb-6 ${theme.accent}`}>Painel Admin</h1>
            {navItems.map(item => (
                <button
                key={item.section}
                onClick={() => setCurrentSection(item.section)}
                className={`w-full flex items-center space-x-3 p-3 rounded-md hover:opacity-80 transition mb-2 ${currentSection === item.section ? `${theme.primaryButtonBg} ${theme.primaryButtonText}` : `${theme.secondaryButtonBg} ${theme.secondaryButtonText}`}`}
            >
                {React.cloneElement(item.icon, { 
                  className: `w-5 h-5 ${currentSection === item.section ? theme.primaryButtonText : theme.secondaryButtonText}`
                })}
                <span>{item.label}</span>
            </button>
            ))}
             <Link 
              to="/" 
              className={`w-full flex items-center space-x-3 p-3 rounded-md hover:opacity-80 transition mt-4 ${theme.secondaryButtonBg} ${theme.secondaryButtonText}`}
            >
              <HomeIcon className={`w-5 h-5 ${theme.secondaryButtonText}`} />
              <span>Voltar para o Início</span>
            </Link>
        </div>

        <button
          onClick={handleLogout}
          className={`w-full mt-auto p-3 rounded-md ${theme.secondaryButtonBg} ${theme.secondaryButtonText} hover:opacity-80 transition`}
        >
          Sair
        </button>
      </nav>
      <main className="flex-1 p-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
         {storageError && (
          <div className={`p-4 mb-6 text-sm text-red-700 bg-red-100 border-l-4 border-red-500 rounded-md shadow-md flex justify-between items-start`} role="alert">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <div>
                <p className="font-bold">Alerta de Sistema ou Armazenamento:</p>
                <p className="text-sm">{storageError}</p>
              </div>
            </div>
            <button 
              onClick={clearStorageError} 
              className={`ml-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 items-center justify-center`}
              aria-label="Fechar"
            >
              <span className="sr-only">Fechar</span>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          </div>
        )}
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminPanel;
