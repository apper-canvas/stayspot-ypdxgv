import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { setUser, clearUser } from './store/userSlice';

export const AuthContext = createContext(null);

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  // Initialize dark mode based on user preference
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                 window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function(user) {
        // Store user data in Redux store
        let currentPath = window.location.pathname + window.location.search;
        if (user && user.isAuthenticated) {
          dispatch(setUser(user));
          navigate('/');
        } else if (!currentPath.includes('login')) {
          navigate(currentPath);
        } else {
          navigate('/login');
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
    
    setIsInitialized(true);
  }, [dispatch, navigate]);

  // Apply dark mode class to html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // Icon components
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const HomeIcon = getIcon('Home');
  const LogoutIcon = getIcon('LogOut');

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-800 dark:text-surface-100 transition-colors duration-300">
        {/* Header - Only show on authenticated routes */}
        {isAuthenticated && (
          <header className="sticky top-0 z-10 bg-white dark:bg-surface-800 shadow-sm backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <HomeIcon className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-primary dark:text-primary-light">StaySpot</h1>
              </div>
              
              <div className="flex items-center gap-3">
                {userState.user && (
                  <span className="hidden md:block text-sm font-medium">
                    Welcome, {userState.user.firstName || userState.user.emailAddress}
                  </span>
                )}
                
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? 
                    <SunIcon className="h-5 w-5 text-yellow-400" /> : 
                    <MoonIcon className="h-5 w-5 text-primary" />
                  }
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={authMethods.logout}
                  className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                  aria-label="Logout"
                >
                  <LogoutIcon className="h-5 w-5 text-surface-600 dark:text-surface-400" />
                </motion.button>
              </div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className={`container mx-auto px-4 py-8 ${!isAuthenticated ? 'min-h-screen' : ''}`}>
          <Routes>
            {/* Public routes - accessible only when NOT authenticated */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
            
            {/* Protected routes - require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              {/* Add other protected routes here */}
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer - Only show on authenticated routes */}
        {isAuthenticated && (
          <footer className="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-6 mt-12">
            <div className="container mx-auto px-4">
              <p className="text-center text-surface-500 dark:text-surface-400 text-sm">
                &copy; {new Date().getFullYear()} StaySpot. All rights reserved.
              </p>
            </div>
          </footer>
        )}

        {/* Toast Container */}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
          toastClassName="backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90"
          className="z-50"
        />
      </div>
    </AuthContext.Provider>
  )
}

export default App;