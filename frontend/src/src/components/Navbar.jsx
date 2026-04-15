import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-fuchsia-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow">
            L
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            Lost<span className="text-violet-600">&</span>Found
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-violet-600 transition">Browse</Link>
          {user && <Link to="/inbox" className="hover:text-violet-600 transition">Inbox</Link>}
          {user && <Link to="/profile" className="hover:text-violet-600 transition">{user.name}</Link>}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/items/new"
                className="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow hover:opacity-90 transition">
                + Post Item
              </Link>
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-800 transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-violet-600 transition font-medium">Login</Link>
              <Link to="/register"
                className="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow hover:opacity-90 transition">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-3 text-sm font-medium text-gray-700 bg-white">
          <Link to="/" onClick={() => setMenuOpen(false)}>Browse</Link>
          {user && <Link to="/items/new" onClick={() => setMenuOpen(false)}>+ Post Item</Link>}
          {user && <Link to="/inbox" onClick={() => setMenuOpen(false)}>Inbox</Link>}
          {user && <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>}
          {user
            ? <button onClick={handleLogout} className="text-left text-red-500">Logout</button>
            : <><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
               <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link></>
          }
        </div>
      )}
    </nav>
  );
};

export default Navbar;
