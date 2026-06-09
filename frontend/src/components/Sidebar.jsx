import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Collapsible State (Sliderbar behavior)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar_collapsed') === 'true';
    }
    return false;
  });

  // Dark Mode State (defaulting to dark mode, which is now premium obsidian black)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      return storedTheme !== 'light'; // default to true (dark) if not explicitly set to light
    }
    return true;
  });

  // Toggle theme class and save to localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-luxury-dark-bg/60 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container (Sliderbar) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-luxury-light-card dark:bg-luxury-dark-card border-r border-luxury-light-border dark:border-luxury-dark-border flex flex-col justify-between transition-all duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Boundary Slide/Collapse Toggle Button (Desktop only) */}
        <button
          onClick={toggleCollapse}
          className="hidden md:flex absolute top-5 -right-3 w-6 h-6 rounded-full bg-luxury-light-card dark:bg-luxury-dark-card border border-luxury-light-border dark:border-luxury-dark-border items-center justify-center text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary shadow-md hover:bg-luxury-light-card-hover dark:hover:bg-luxury-dark-card-hover hover:text-luxury-light-text-primary dark:hover:text-luxury-dark-text-primary transition-all z-50 focus:outline-none"
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Header Branding */}
        <div>
          <div
            className={`h-16 flex items-center border-b border-luxury-light-border dark:border-luxury-dark-border transition-all duration-300 ${
              isCollapsed ? 'px-0 justify-center' : 'px-6 justify-between'
            }`}
          >
            <NavLink
              to="/"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
              onClick={onClose}
            >
              <div className="w-9 h-9 rounded-xl  flex items-center justify-center shadow-lg shrink-0">
               <img src="/task.png" alt="image"className="w-10 h-10"/>
              </div>
              {!isCollapsed && (
                <span className="text-xl font-bold luxury-text-gradient whitespace-nowrap animate-fade-in-up">
                Task Management
                </span>
              )}
            </NavLink>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 md:hidden rounded-lg text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:bg-luxury-light-card-hover dark:hover:bg-luxury-dark-card-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 py-6 overflow-y-auto space-y-6">
            <div>
              {!isCollapsed ? (
                <h2 className="px-3 text-[10px] font-bold text-luxury-light-text-secondary/70 dark:text-luxury-dark-text-secondary/70 uppercase tracking-widest mb-3 whitespace-nowrap">
                
                </h2>
              ) : (
                <div className="border-b border-luxury-light-border dark:border-luxury-dark-border my-2" />
              )}
              <nav className="space-y-1.5">
                <NavLink
                  to="/"
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center rounded-xl text-sm font-medium transition-all duration-250 relative group ${
                      isCollapsed ? 'justify-center p-2.5 mx-auto w-12 h-12' : 'gap-3 px-3.5 py-2.5'
                    } ${
                      isActive
                        ? 'bg-luxury-accent/10 text-luxury-accent-hover dark:bg-luxury-accent/5 dark:text-luxury-accent font-bold shadow-sm border border-luxury-light-border/70 dark:border-luxury-dark-border/40'
                        : 'text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:bg-luxury-light-card-hover dark:hover:bg-luxury-dark-card-hover hover:text-luxury-light-text-primary dark:hover:text-luxury-dark-text-primary'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && !isCollapsed && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-luxury-accent" />
                      )}
                      <svg
                        className={`w-5 h-5 transition-transform group-hover:scale-110 duration-200 shrink-0 ${
                          isActive ? 'text-luxury-accent-hover dark:text-luxury-accent' : 'text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                      {!isCollapsed && <span>Dashboard</span>}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <span className="absolute left-16 bg-luxury-dark-card text-luxury-dark-text-primary border border-luxury-dark-border text-xs px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shadow-lg whitespace-nowrap z-50">
                          Dashboard
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </nav>
            </div>

            <div>
              {!isCollapsed ? (
                <h2 className="px-3 text-[10px] font-bold text-luxury-light-text-secondary/70 dark:text-luxury-dark-text-secondary/70 uppercase tracking-widest mb-3 whitespace-nowrap">
                
                </h2>
              ) : (
                <div className="border-b border-luxury-light-border dark:border-luxury-dark-border my-2" />
              )}
              <nav className="space-y-1.5">
                <NavLink
                  to="/analytics"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center rounded-xl text-sm font-semibold transition-all group duration-250 cursor-pointer relative ${
                      isCollapsed ? 'justify-center p-2.5 mx-auto w-12 h-12' : 'gap-3 px-3.5 py-2.5'
                    } ${
                      isActive
                        ? 'bg-luxury-accent/10 text-luxury-accent-hover dark:bg-luxury-accent/5 dark:text-luxury-accent font-bold shadow-sm border border-luxury-light-border/70 dark:border-luxury-dark-border/40'
                        : 'text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:bg-luxury-light-card-hover dark:hover:bg-luxury-dark-card-hover hover:text-luxury-light-text-primary dark:hover:text-luxury-dark-text-primary'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && !isCollapsed && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-luxury-accent" />
                      )}
                      <svg
                        className={`w-5 h-5 transition-transform group-hover:scale-110 duration-200 shrink-0 ${
                          isActive ? 'text-luxury-accent-hover dark:text-luxury-accent' : 'text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"
                        />
                      </svg>
                      {!isCollapsed && <span>Analytics</span>}

                      {isCollapsed && (
                        <span className="absolute left-16 bg-luxury-dark-card text-luxury-dark-text-primary border border-luxury-dark-border text-xs px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shadow-lg whitespace-nowrap z-50">
                          Analytics
                        </span>
                      )}
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/calendar"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center rounded-xl text-sm font-semibold transition-all group duration-250 cursor-pointer relative ${
                      isCollapsed ? 'justify-center p-2.5 mx-auto w-12 h-12' : 'gap-3 px-3.5 py-2.5'
                    } ${
                      isActive
                        ? 'bg-luxury-accent/10 text-luxury-accent-hover dark:bg-luxury-accent/5 dark:text-luxury-accent font-bold shadow-sm border border-luxury-light-border/70 dark:border-luxury-dark-border/40'
                        : 'text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:bg-luxury-light-card-hover dark:hover:bg-luxury-dark-card-hover hover:text-luxury-light-text-primary dark:hover:text-luxury-dark-text-primary'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && !isCollapsed && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-luxury-accent" />
                      )}
                      <svg
                        className={`w-5 h-5 transition-transform group-hover:scale-110 duration-200 shrink-0 ${
                          isActive ? 'text-luxury-accent-hover dark:text-luxury-accent' : 'text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {!isCollapsed && <span>Calendar</span>}

                      {isCollapsed && (
                        <span className="absolute left-16 bg-luxury-dark-card text-luxury-dark-text-primary border border-luxury-dark-border text-xs px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shadow-lg whitespace-nowrap z-50">
                          Calendar
                        </span>
                      )}
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/focus"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center rounded-xl text-sm font-semibold transition-all group duration-250 cursor-pointer relative ${
                      isCollapsed ? 'justify-center p-2.5 mx-auto w-12 h-12' : 'gap-3 px-3.5 py-2.5'
                    } ${
                      isActive
                        ? 'bg-luxury-accent/10 text-luxury-accent-hover dark:bg-luxury-accent/5 dark:text-luxury-accent font-bold shadow-sm border border-luxury-light-border/70 dark:border-luxury-dark-border/40'
                        : 'text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:bg-luxury-light-card-hover dark:hover:bg-luxury-dark-card-hover hover:text-luxury-light-text-primary dark:hover:text-luxury-dark-text-primary'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && !isCollapsed && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-luxury-accent" />
                      )}
                      <svg
                        className={`w-5 h-5 transition-transform group-hover:scale-110 duration-200 shrink-0 ${
                          isActive ? 'text-luxury-accent-hover dark:text-luxury-accent' : 'text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                        />
                      </svg>
                      {!isCollapsed && <span>Focus Space</span>}

                      {isCollapsed && (
                        <span className="absolute left-16 bg-luxury-dark-card text-luxury-dark-text-primary border border-luxury-dark-border text-xs px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shadow-lg whitespace-nowrap z-50">
                          Focus Space
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </nav>
            </div>
          </div>
        </div>

        {/* Footer Area - Theme Toggle & Profile Info */}
        <div className="p-4 border-t border-luxury-light-border dark:border-luxury-dark-border space-y-4 bg-luxury-light-card-hover/20 dark:bg-luxury-dark-card-hover/20 shrink-0">
          {/* Theme Toggle Button */}
          <div
            className={`flex items-center justify-between px-2 ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            {!isCollapsed && (
              <span className="text-[10px] font-bold text-luxury-light-text-secondary/70 dark:text-luxury-dark-text-secondary/70 uppercase tracking-widest">
                Theme Mode
              </span>
            )}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none ${
                isCollapsed
                  ? 'w-10 h-10 bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover justify-center text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:bg-luxury-light-card dark:hover:bg-luxury-dark-card group'
                  : `h-6 w-11 border-2 border-transparent cursor-pointer ${
                      isDark ? 'bg-luxury-accent' : 'bg-luxury-light-border/60 dark:bg-luxury-dark-card-hover'
                    }`
              }`}
              aria-label="Toggle Theme Mode"
            >
              {isCollapsed ? (
                <>
                  {isDark ? (
                    <svg className="w-5 h-5 text-luxury-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="absolute left-16 bg-luxury-dark-card text-luxury-dark-text-primary border border-luxury-dark-border text-xs px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shadow-lg whitespace-nowrap z-50">
                    Toggle Theme ({isDark ? 'Light' : 'Dark'})
                  </span>
                </>
              ) : (
                <span
                  className={`pointer-events-none inline-flex h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                    isDark ? 'translate-x-5' : 'translate-x-0'
                  } items-center justify-center`}
                >
                  {isDark ? (
                    <svg className="w-3 h-3 text-luxury-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
              )}
            </button>
          </div>

          {/* User Profile Card */}
          <div
            className={`flex items-center gap-3 rounded-xl bg-luxury-light-card-hover dark:bg-luxury-dark-card-hover border border-luxury-light-border dark:border-luxury-dark-border transition-colors relative group ${
              isCollapsed ? 'justify-center p-1.5 w-12 h-12 mx-auto' : 'p-2'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-luxury-accent-hover via-luxury-accent to-luxury-mint flex items-center justify-center text-white font-bold shadow-md text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-luxury-light-text-primary dark:text-luxury-dark-text-primary truncate">
                  {user?.name || 'Guest User'}
                </p>
                <p className="text-[10px] text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary truncate">
                  {user?.email || 'guest@example.com'}
                </p>
              </div>
            )}

            {isCollapsed && (
              <span className="absolute left-16 bg-luxury-dark-card text-luxury-dark-text-primary border border-luxury-dark-border text-xs px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shadow-lg whitespace-nowrap z-50">
                {user?.name} ({user?.email})
              </span>
            )}
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center justify-center gap-2 rounded-xl transition-all text-xs font-semibold text-red-500 hover:text-red-600 bg-red-500/5 dark:bg-red-500/5 hover:bg-red-500/10 dark:hover:bg-red-500/10 border border-transparent hover:border-red-500/15 relative group ${
              isCollapsed ? 'p-2.5 mx-auto w-12 h-12' : 'px-4 py-2.5'
            }`}
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {!isCollapsed && <span>Sign Out</span>}

            {isCollapsed && (
              <span className="absolute left-16 bg-red-600 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shadow-lg whitespace-nowrap z-50">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
