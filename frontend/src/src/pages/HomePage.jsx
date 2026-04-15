import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Accessories', 'Keys', 'ID/Cards', 'Bags', 'Other'];

const HERO_STATS = [
  { label: 'Items Posted', value: '500+' },
  { label: 'Items Recovered', value: '320+' },
  { label: 'Students Helped', value: '1,200+' },
];

const HomePage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', category: '', keyword: '', location: '' });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const res = await api.get('/items', { params });
      setItems(res.data.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [filters]);

  const handleFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-fuchsia-600 to-pink-500">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          {/* Text */}
          <div className="flex-1 text-white text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              🎓 Smart Campus Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Lost something?<br />
              <span className="text-yellow-300">We'll help you find it.</span>
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-md">
              A centralized platform for the campus community to report, search, and recover lost belongings.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link to="/items/new"
                className="bg-white text-violet-700 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                + Post an Item
              </Link>
              <a href="#browse"
                className="bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition">
                Browse Items
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-10 justify-center md:justify-start">
              {HERO_STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-extrabold text-white">{s.value}</div>
                  <div className="text-xs text-white/70">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image collage */}
          <div className="flex-1 hidden md:grid grid-cols-2 gap-3 max-w-sm">
            {[
              'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop',
              'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=200&fit=crop',
              'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&h=200&fit=crop',
              'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=200&fit=crop',
            ].map((src, i) => (
              <img key={i} src={src} alt="lost item"
                className={`rounded-2xl object-cover shadow-xl ${i === 1 ? 'mt-6' : ''} ${i === 3 ? '-mt-6' : ''}`}
                style={{ height: '140px', width: '100%' }} />
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📝', title: 'Post Your Item', desc: 'Report a lost or found item with details, location, and a photo.' },
              { icon: '🔍', title: 'Smart Matching', desc: 'Our system automatically matches lost items with found reports.' },
              { icon: '🤝', title: 'Connect & Recover', desc: 'Message the poster securely and arrange to get your item back.' },
            ].map((step) => (
              <div key={step.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="text-4xl mb-3">{step.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Browse section */}
      <div id="browse" className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Browse Items</h2>
          {user && (
            <Link to="/items/new"
              className="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition">
              + Post Item
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50"
              value={filters.type} onChange={(e) => handleFilter('type', e.target.value)}>
              <option value="">All Types</option>
              <option value="lost">🔍 Lost</option>
              <option value="found">📦 Found</option>
            </select>
            <select
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50"
              value={filters.category} onChange={(e) => handleFilter('category', e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50 col-span-2 md:col-span-1"
              placeholder="🔎 Search keyword..." value={filters.keyword}
              onChange={(e) => handleFilter('keyword', e.target.value)} />
            <input
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50"
              placeholder="📍 Location..." value={filters.location}
              onChange={(e) => handleFilter('location', e.target.value)} />
          </div>
          {hasFilters && (
            <button onClick={() => setFilters({ type: '', category: '', keyword: '', location: '' })}
              className="mt-3 text-xs text-violet-600 hover:underline">
              Clear filters
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <img src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=300&h=200&fit=crop"
              alt="empty" className="w-40 h-28 object-cover rounded-2xl mx-auto mb-4 opacity-60" />
            <p className="text-gray-500 font-medium">No items found.</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or be the first to post!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((item) => <ItemCard key={item._id} item={item} />)}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      {!user && (
        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 py-14 mt-8">
          <div className="max-w-2xl mx-auto text-center px-4">
            <h2 className="text-3xl font-extrabold text-white mb-3">Ready to get started?</h2>
            <p className="text-white/80 mb-6">Join hundreds of students already using the platform.</p>
            <Link to="/register"
              className="bg-white text-violet-700 font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all inline-block">
              Create Free Account
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-sm py-8 text-center">
        <p>© 2025 Smart Campus Lost &amp; Found · Built for the university community</p>
      </footer>
    </div>
  );
};

export default HomePage;
