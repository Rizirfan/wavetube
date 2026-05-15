import { useRef, useState } from 'react';
import { Search, LogOut, Sun, Moon } from 'lucide-react';
import { useSearchStore } from '../store/useSearchStore';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { query, search } = useSearchStore();
  const { user, logout } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [isLight, setIsLight] = useState(() => document.body.classList.contains('light'));

  const toggleTheme = () => {
    setIsLight(prev => {
      const next = !prev;
      if (next) document.body.classList.add('light');
      else document.body.classList.remove('light');
      return next;
    });
  };

  return (
    <header
      className="flex-shrink-0 flex items-center gap-3 px-4 md:px-6 h-14 sticky top-0 z-30 transition-colors"
      style={{
        background: 'var(--surface-2)',
        opacity: 0.95,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Search */}
      <div className="flex-1 max-w-[440px]">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
            style={{ color: 'var(--text-3)' }}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search songs, artists…"
            defaultValue={query}
            onChange={e => search(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[13px] font-medium rounded-lg outline-none transition-all"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-1)',
              caretColor: 'var(--primary)',
            }}
            onFocus={e => (e.target.style.borderColor = 'rgba(250,36,60,0.4)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex w-8 h-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          style={{ color: 'var(--text-3)' }}
          title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {isLight ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Avatar + name */}
        <div
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
              style={{ background: 'var(--primary)' }}
            >
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <span
            className="hidden md:block text-[12px] font-semibold max-w-[100px] truncate"
            style={{ color: 'var(--text-1)' }}
          >
            {user?.displayName || user?.email?.split('@')[0]}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Sign out"
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
          style={{ color: 'var(--text-3)' }}
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
