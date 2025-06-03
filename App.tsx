
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { AppContextProvider, useAppContext } from './contexts/AppContext';
import DayCounter from './components/DayCounter';
import PhotoGallery from './components/PhotoGallery';
import QuoteDisplay from './components/QuoteDisplay';
import AdminPanel from './components/AdminPanel';
import LoveLettersDisplay from './components/LoveLettersDisplay'; // Reverted import path

// Icons for Main Site Login & Header
const EyeIcon = ({ className }: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const EyeSlashIcon = ({ className }: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228" /></svg>;

const NavLinkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className || ''}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995a6.427 6.427 0 0 1 0 .255c0 .382.145.755.438.995l1.003.827c.431.354.523 1.001.26 1.431l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 0 1-.22.127c-.333.183-.583.496-.646.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313.686-.646.87-.074.04-.147.083-.22.127a6.501 6.501 0 0 1-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.437-.995a6.427 6.427 0 0 1 0-.255c0-.382-.145-.755-.438-.995l-1.004-.827a1.125 1.125 0 0 1-.26-1.431l1.296-2.247a1.125 1.125 0 0 1 1.37.49l1.217.456c.355.133.75.072 1.075-.124a6.57 6.57 0 0 1 .22-.127c.333.183-.583.496-.646.87l.213-1.281Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
);

const HeartIconSolid = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className || ''}`}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);


const MainSiteLayout: React.FC = () => {
  const { theme, isAuthenticated, login, isLoading } = useAppContext();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleMainSiteLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const success = await login(password);
    if (!success) {
      setError('Senha incorreta. Por favor, tente novamente para acessar nosso cantinho.');
    } else {
      setPassword(''); 
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${theme.background} ${theme.text} transition-colors duration-500`}>
        <div className={`${theme.cardBg} p-8 rounded-xl shadow-2xl w-full max-w-md text-center animate-gentle-fade-in`}>
          <HeartIconSolid className={`w-16 h-16 ${theme.accent} mx-auto mb-6`} />
          <h1 className={`text-3xl font-bold mb-2 ${theme.accent}`}>Nosso Cantinho Secreto</h1>
          <p className={`mb-6 opacity-80 ${theme.text}`}>Por favor, insira a senha para continuar.</p>
          <form onSubmit={handleMainSiteLogin} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Senha"
                className={`w-full p-3 rounded-lg ${theme.borderColor} border bg-transparent ${theme.text} focus:ring-2 ${theme.accent.replace('text-', 'ring-')} focus:border-transparent outline-none transition`}
                aria-label="Senha para acessar o site"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className={`absolute inset-y-0 right-0 px-3 flex items-center ${theme.text} opacity-70 hover:opacity-100`}
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeSlashIcon className={`${theme.text}`} /> : <EyeIcon className={`${theme.text}`} />} 
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-3 rounded-lg ${theme.primaryButtonBg} ${theme.primaryButtonText} font-semibold transition hover:opacity-90 disabled:opacity-50`}
            >
              {isLoading ? 'Entrando...' : 'Acessar'}
            </button>
          </form>
        </div>
        <p className={`mt-8 text-sm opacity-70 ${theme.text}`}>
          Ou, <Link to="/admin" className={`underline ${theme.accent} hover:opacity-80`}>vá para o Painel de Administração</Link>.
        </p>
      </div>
    );
  }

  // If authenticated, show the main site content
  return (
    <div className={`flex flex-col min-h-screen ${theme.background} ${theme.text} transition-colors duration-500`}>
      <header className={`py-4 px-6 shadow-md ${theme.headerFooterBg} sticky top-0 z-40`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className={`text-3xl font-bold ${theme.accent} flex items-center hover:opacity-80 transition-opacity`}>
            <HeartIconSolid className="mr-2"/> Nossa História de Amor
          </Link>
          <nav>
            <Link to="/admin" className={`py-2 px-4 rounded-md ${theme.secondaryButtonBg} ${theme.secondaryButtonText} hover:opacity-80 transition flex items-center`}>
                <NavLinkIcon className="mr-2" /> Painel Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <DayCounter />
        <QuoteDisplay />
        <PhotoGallery />
        <LoveLettersDisplay /> {/* Component is used here */}
      </main>

      <footer className={`py-6 text-center ${theme.headerFooterBg} ${theme.text} opacity-80`}>
        <p>&copy; {new Date().getFullYear()} Nosso Lugar Especial. Feito com Amor.</p>
      </footer>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { theme } = useAppContext(); 

  return (
    <Routes>
      <Route path="/admin" element={
          <div className={`${theme.background} ${theme.text}`}>
              <AdminPanel />
          </div>
        } 
      />
      <Route path="/*" element={<MainSiteLayout />} />
    </Routes>
  );
};


const App: React.FC = () => {
  return (
    <AppContextProvider>
        <HashRouter>
            <AppRoutes />
        </HashRouter>
    </AppContextProvider>
  );
};

export default App;