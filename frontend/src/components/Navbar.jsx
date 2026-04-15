import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#1a3a2a] text-white shadow-lg sticky top-0 z-50" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white no-underline">
          <span className="text-2xl">🎓</span>
          <div className="leading-tight">
            <span className="font-bold text-lg tracking-tight">Campus</span>
            <span className="text-amber-400 font-bold text-lg"> L&F</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 text-sm">
          <Link to="/"
            className={`px-3 py-2 rounded-lg transition font-medium ${isActive('/') ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
            Browse
          </Link>
          {user ? (
            <>
              <Link to="/items/new"
                className="ml-2 bg-amber-400 text-[#1a3a2a] px-4 py-2 rounded-lg font-bold hover:bg-amber-300 transition">
                + Post Item
              </Link>
              <Link to="/inbox"
                className={`px-3 py-2 rounded-lg transition font-medium ${isActive('/inbox') ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                Inbox
              </Link>
              <Link to="/profile"
                className="flex items-center gap-2 ml-1 px-3 py-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition font-medium">
                <span className="w-7 h-7 rounded-full bg-amber-400 text-[#1a3a2a] flex items-center justify-center font-bold text-xs">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                {user.name?.split(' ')[0]}
              </Link>
              <button onClick={handleLogout}
                className="ml-1 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className="px-3 py-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition font-medium">
                Login
              </Link>
              <Link to="/register"
                className="ml-1 bg-amber-400 text-[#1a3a2a] px-4 py-2 rounded-lg font-bold hover:bg-amber-300 transition">
                Register
              </Link>
            </>
          )}

          {/* Dark mode toggle */}
          <button onClick={toggle}
            className="ml-2 p-2 rounded-lg hover:bg-white/10 transition text-white/80 hover:text-white"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {dark ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Mobile right side */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-white/10 transition">
            {dark ? '☀️' : '🌙'}
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 transition" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-0.5 bg-white mb-1"></div>
            <div className="w-5 h-0.5 bg-white mb-1"></div>
            <div className="w-5 h-0.5 bg-white"></div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#122a1e] border-t border-white/10 px-4 py-3 flex flex-col gap-2 text-sm">
          <Link to="/" onClick={() => setMenuOpen(false)} className="py-2 text-white/80 hover:text-white">Browse</Link>
          {user ? (
            <>
              <Link to="/items/new" onClick={() => setMenuOpen(false)} className="py-2 text-amber-400 font-semibold">+ Post Item</Link>
              <Link to="/inbox" onClick={() => setMenuOpen(false)} className="py-2 text-white/80 hover:text-white">Inbox</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="py-2 text-white/80 hover:text-white">{user.name}</Link>
              <button onClick={handleLogout} className="py-2 text-left text-white/60 hover:text-white">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="py-2 text-white/80 hover:text-white">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="py-2 text-amber-400 font-semibold">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
