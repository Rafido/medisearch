import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer/Footer';
import SearchPage from './pages/SearchPage/SearchPage';
import DatabasePage from './pages/DatabasePage/DatabasePage';
import LoginPage from './pages/LoginPage';
import { AUTH_STORAGE } from './utils/auth';
import './App.css';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock user state for demonstration
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = AUTH_STORAGE.isAuthenticated();
        const userData = AUTH_STORAGE.getUser();
        
        if (isAuth && userData) {
          setIsAuthenticated(true);
          setUser({
            name: userData.name || 'Administrator',
            email: userData.email || 'admin@smartmedicine.ae',
            avatar: undefined
          });
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Focus search on Ctrl+K or Cmd+K
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleLogin = () => {
    const userData = AUTH_STORAGE.getUser();
    
    setIsAuthenticated(true);
    setUser({
      name: userData?.name || 'Administrator',
      email: userData?.email || 'admin@smartmedicine.ae',
      avatar: undefined
    });
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    // Clear authentication from storage
    AUTH_STORAGE.clearAuth();
  };

  // Session management - check auth status periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSession = () => {
      try {
        if (!AUTH_STORAGE.isAuthenticated()) {
          handleSignOut();
        }
      } catch (error) {
        console.error('Error checking session:', error);
        handleSignOut();
      }
    };

    // Check session every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{
            color: '#64748b',
            fontSize: '1rem',
            margin: 0
          }}>Loading Smart Medicine Finder...</p>
          <style>
            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
          </style>
        </div>
      </div>
    );
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app">
        <Header 
          user={user} 
          onSignOut={handleSignOut}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/database" element={<DatabasePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
