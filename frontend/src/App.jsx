import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import FocusSpace from './pages/FocusSpace';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Unauthenticated layout (Centered card view)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-light-bg dark:bg-luxury-dark-bg px-4 py-8 transition-colors duration-200">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  // Authenticated layout (Sidebar + main panel)
  return (
    <div className="min-h-screen flex bg-luxury-light-bg dark:bg-luxury-dark-bg text-luxury-light-text-primary dark:text-luxury-dark-text-primary transition-colors duration-200">
      {/* Sidebar navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-luxury-light-card dark:bg-luxury-dark-card border-b border-luxury-light-border dark:border-luxury-dark-border sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-luxury-accent-hover via-luxury-accent to-luxury-mint flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-lg font-bold luxury-text-gradient">
              AuraTask
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:bg-luxury-light-card-hover dark:hover:bg-luxury-dark-card-hover rounded-lg transition-colors focus:outline-none"
            aria-label="Open Sidebar"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        {/* Primary Page Canvas */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-8 w-full max-w-7xl mx-auto">
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/focus" 
              element={
                <ProtectedRoute>
                  <FocusSpace />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer 
          position="bottom-right" 
          autoClose={3000}
          theme="colored"
        />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
