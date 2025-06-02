import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for Home button
import { useAppContext } from '../contexts/AppContext';
import { Photo, ThemeColors } from '../types';
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


type AdminSection = 'dashboard' | 'theme' | 'photos' | 'quotes' | 'password';

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
    changeAdminPassword,
    isLoading
  } = useAppContext();

  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentSection, setCurrentSection] = useState<AdminSection>('dashboard');

  // States for forms
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  const [quote1, setQuote1] = useState(content.quotes[0]);
  const [quote2, setQuote2] = useState(content.quotes[1]);

  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmNewAdminPassword, setConfirmNewAdminPassword] = useState('');


  // Sync quotes from context
  useEffect(() => {
    setQuote1(content.quotes[0]);
    setQuote2(content.quotes[1]);
  }, [content.quotes]);

  const resetPhotoForm = () => {
    setNewPhotoFile(null);
    setNewPhotoPreview(null);
    setNewPhotoCaption('');
    setEditingPhoto(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setNewPhotoFile(null);
      setNewPhotoPreview(null);
      // If editing, and file is cleared, revert preview to original photo's URL
      if (editingPhoto) {
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

  const handleAddPhoto = (e: FormEvent) => {
    e.preventDefault();
    if (!newPhotoFile) {
      alert('Por favor, selecione um arquivo de imagem.');
      return;
    }
    if (newPhotoPreview) { // newPhotoPreview will hold the base64 string
        addPhoto({ url: newPhotoPreview, caption: newPhotoCaption });
        resetPhotoForm();
    } else {
        // Fallback if preview didn't load, though file selection implies it should
        const reader = new FileReader();
        reader.onloadend = () => {
            addPhoto({ url: reader.result as string, caption: newPhotoCaption });
            resetPhotoForm();
        };
        if (newPhotoFile) { // Check added to ensure newPhotoFile is not null
            reader.readAsDataURL(newPhotoFile);
        }
    }
  };

  const handleEditPhotoClick = (photo: Photo) => {
    setEditingPhoto(photo);
    setNewPhotoCaption(photo.caption || '');
    setNewPhotoPreview(photo.url); // This URL is already base64 or external
    setNewPhotoFile(null); // Clear file input for new selection if desired
  };
  
  const handleUpdatePhoto = (e: FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    if (newPhotoFile && newPhotoPreview) { // New file was selected and read
      updatePhoto(editingPhoto.id, newPhotoPreview, newPhotoCaption);
    } else { // No new file, just update caption or keep original image
      updatePhoto(editingPhoto.id, editingPhoto.url, newPhotoCaption);
    }
    resetPhotoForm();
  };


  const handleSaveQuotes = () => {
    updateQuote(0, quote1);
    updateQuote(1, quote2);
    alert('Citações salvas!');
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (newAdminPassword !== confirmNewAdminPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    if (newAdminPassword.length < 4) {
      alert('A senha deve ter pelo menos 4 caracteres.');
      return;
    }
    const success = await changeAdminPassword(newAdminPassword);
    if (success) {
      setNewAdminPassword('');
      setConfirmNewAdminPassword('');
    }
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
              disabled={isLoading}
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
                <button onClick={() => setCurrentSection('theme')} className={`p-4 rounded-lg ${theme.secondaryButtonBg} ${theme.secondaryButtonText} text-left hover:shadow-md transition`}>
                    <PaintBrushIcon className="inline-block mr-2 w-6 h-6" /> Personalizar Aparência
                </button>
                <button onClick={() => setCurrentSection('photos')} className={`p-4 rounded-lg ${theme.secondaryButtonBg} ${theme.secondaryButtonText} text-left hover:shadow-md transition`}>
                    <PhotoIcon className="inline-block mr-2 w-6 h-6" /> Gerenciar Galeria de Fotos
                </button>
                <button onClick={() => setCurrentSection('quotes')} className={`p-4 rounded-lg ${theme.secondaryButtonBg} ${theme.secondaryButtonText} text-left hover:shadow-md transition`}>
                    <PencilSquareIcon className="inline-block mr-2 w-6 h-6" /> Editar Citações Afetuosas
                </button>
                <button onClick={() => setCurrentSection('password')} className={`p-4 rounded-lg ${theme.secondaryButtonBg} ${theme.secondaryButtonText} text-left hover:shadow-md transition`}>
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
            <h2 className={`text-2xl font-semibold mb-4 ${theme.accent}`}>{editingPhoto ? 'Editar Foto' : 'Adicionar Nova Foto'}</h2>
            <form onSubmit={editingPhoto ? handleUpdatePhoto : handleAddPhoto} className={`mb-6 p-6 border ${theme.borderColor} rounded-lg shadow-md space-y-4 ${theme.cardBg}`}>
              <div>
                <label htmlFor="photoFile" className={`block text-sm font-medium ${theme.text} mb-1`}>
                  Selecionar Imagem
                </label>
                <input
                  type="file"
                  id="photoFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`w-full p-2 border ${theme.borderColor} rounded-md ${theme.text} ${theme.cardBg.replace('bg-','bg-opacity-50 ')} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold ${theme.secondaryButtonBg} ${theme.secondaryButtonText} hover:file:opacity-80`}
                />
              </div>

              {newPhotoPreview && (
                <div className="my-2">
                  <p className={`text-sm ${theme.text} mb-1`}>Pré-visualização:</p>
                  <img src={newPhotoPreview} alt="Pré-visualização da foto" className="max-w-xs max-h-48 rounded-md border object-contain shadow-sm"/>
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
                <button type="submit" className={`py-2 px-5 rounded ${theme.primaryButtonBg} ${theme.primaryButtonText} transition flex items-center justify-center disabled:opacity-60`} disabled={isLoading || (!newPhotoFile && !editingPhoto)}>
                  <ArrowUpTrayIcon className="w-5 h-5 mr-2"/>
                  {editingPhoto ? 'Atualizar Foto' : 'Adicionar Foto'}
                </button>
                {editingPhoto && (
                  <button type="button" onClick={resetPhotoForm} className={`py-2 px-4 rounded ${theme.secondaryButtonBg} ${theme.secondaryButtonText} transition`}>
                    Cancelar Edição
                  </button>
                )}
              </div>
            </form>

            <h3 className={`text-xl font-semibold mt-8 mb-4 ${theme.accent}`}>Fotos Adicionadas</h3>
            {content.photos.length === 0 ? (
                <p className={`${theme.text}`}>Nenhuma foto adicionada ainda.</p>
            ) : (
                <div className="space-y-3">
                {content.photos.map(photo => (
                    <div key={photo.id} className={`flex items-center justify-between p-3 border ${theme.borderColor} rounded-lg ${theme.cardBg} shadow-sm`}>
                    <img src={photo.url} alt={photo.caption || 'Foto da galeria'} className="w-20 h-20 object-cover rounded-md mr-4 border"/>
                    <span className={`flex-grow truncate ${theme.text}`} title={photo.caption || photo.id}>{photo.caption || 'Sem legenda'}</span>
                    <div className="flex-shrink-0 space-x-2">
                        <button onClick={() => handleEditPhotoClick(photo)} className={`p-2 rounded-md ${theme.secondaryButtonBg} ${theme.secondaryButtonText} hover:opacity-80`} aria-label="Editar foto">
                            <PencilSquareIcon className="w-5 h-5"/>
                        </button>
                        <button onClick={() => {if(confirm('Tem certeza que deseja remover esta foto?')) removePhoto(photo.id)}} className={`p-2 rounded-md ${theme.secondaryButtonBg} text-red-500 hover:bg-red-100 hover:text-red-700`} aria-label="Remover foto">
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
              <button type="submit" disabled={isLoading} className={`py-2 px-4 rounded ${theme.primaryButtonBg} ${theme.primaryButtonText} transition disabled:opacity-50`}>
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
    {label: "Painel", section: "dashboard", icon: <PhotoIcon />}, // Using PhotoIcon as a generic dashboard icon
    {label: "Aparência", section: "theme", icon: <PaintBrushIcon />},
    {label: "Fotos", section: "photos", icon: <PhotoIcon />},
    {label: "Citações", section: "quotes", icon: <PencilSquareIcon />},
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
      <main className="flex-1 p-8 overflow-y-auto">
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminPanel;