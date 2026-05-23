import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Auth from './components/Auth'; 
import Profile from './pages/Profile';
import Home from './pages/Home';          
import Sidebar from './components/Sidebar'; 
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './components/ResetPassword';

// 1. Google OAuth Provider import 
import { GoogleOAuthProvider } from '@react-oauth/google';


function AppContent() {
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Auth checking mechanism
  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = '/login';
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
  <div className="bg-slate-50 min-h-screen font-sans flex flex-col md:flex-row">
    {!isAuthPage && <Sidebar handleLogout={handleLogout} />}

    {/* Main Content Area - FIXED FOR MOBILE */}
    <div className={`flex-1 transition-all duration-300 w-full ${!isAuthPage ? 'pl-0 md:pl-64 pb-24 md:pb-0' : 'pl-0'}`}>
      <main className={`${!isAuthPage ? 'p-4 md:p-6 max-w-7xl mx-auto w-full' : 'w-full'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/signup" element={<Auth initialMode="signup" />} />
          <Route path="/login" element={<Auth initialMode="login" />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
        </Routes>
      </main>
    </div>
  </div>
);
}

function App() {
  return (
    <GoogleOAuthProvider clientId="1019401085962-s7jkvt87ap1b72r8ie8hjdqtvig6504l.apps.googleusercontent.com">
      <Router>
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <AppContent />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;