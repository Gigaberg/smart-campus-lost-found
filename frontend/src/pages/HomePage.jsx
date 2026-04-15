import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Accessories', 'Keys', 'ID/Cards', 'Bags', 'Other'];

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
  const clearFilters = () => setFilters({ type: '', category: '', keyword: '', location: '' });
  const hasFilters = Object.values(filters).some(Boolean);

  const inputCls = "border border-gray-200 dark:border-[#2a4a35] rounded-xl px-3 py-2.5 text-sm bg-gray-50 dark:bg-[#1a2e22] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/30 dark:focus:ring-amber-400/30";

  return (
    <div className="dark:bg-[#0f1f17] min-h-screen">
      {/* Hero — <section> semantic element */}
      <section aria-labelledby="hero-heading" className="bg-[#1a3a2a] text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 id="hero-heading" className="text-4xl font-extrabold mb-3 tracking-tight">
            Lost something? <span className="text-amber-400">Found something?</span>
          </h1>
          <p className="text-white/70 text-lg mb-8">
            The campus lost &amp; found board — post, search, and reconnect items with their owners.
          </p>
          {!user && (
            <div className="flex justify-center gap-3">
              <Link to="/register" className="bg-amber-400 text-[#1a3a2a] px-6 py-3 rounded-xl font-bold hover:bg-amber-300 transition">
                Get Started
              </Link>
              <Link to="/login" className="border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition">
                Sign In
              </Link>
            </div>
          )}
          {user && (
            <Link to="/items/new" className="inline-block bg-amber-400 text-[#1a3a2a] px-6 py-3 rounded-xl font-bold hover:bg-amber-300 transition">
              + Post an Item
            </Link>
          )}
        </div>
      </section>

      {/* How it works — <section> with <ol> ordered list */}
      <section aria-labelledby="how-it-works" className="bg-white dark:bg-[#1a2e22] border-b border-gray-100 dark:border-[#2a4a35] py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 id="how-it-works" className="text-sm font-bold text-[#1a3a2a] dark:text-amber-400 uppercase tracking-wider mb-4 text-center">
            How it works
          </h2>
          {/* <ol> ordered list — syllabus requirement */}
          <ol className="flex flex-col md:flex-row gap-4 md:gap-0 md:divide-x md:divide-gray-200 dark:md:divide-[#2a4a35]">
            <li className="flex-1 flex items-start gap-3 md:px-6 first:pl-0 last:pr-0">
              <span className="w-7 h-7 rounded-full bg-amber-400 text-[#1a3a2a] font-extrabold text-sm flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="text-gray-800 dark:text-gray-100 text-sm">Post your item</strong>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Describe what you lost or found with a photo and location.</p>
              </div>
            </li>
            <li className="flex-1 flex items-start gap-3 md:px-6">
              <span className="w-7 h-7 rounded-full bg-amber-400 text-[#1a3a2a] font-extrabold text-sm flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="text-gray-800 dark:text-gray-100 text-sm">Browse &amp; search</strong>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Filter by category, type, or location to find a match.</p>
              </div>
            </li>
            <li className="flex-1 flex items-start gap-3 md:px-6">
              <span className="w-7 h-7 rounded-full bg-amber-400 text-[#1a3a2a] font-extrabold text-sm flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="text-gray-800 dark:text-gray-100 text-sm">Contact &amp; reunite</strong>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Message the poster directly and arrange to collect the item.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters — inside a <section> */}
        <section aria-labelledby="filter-heading">
          <h2 id="filter-heading" className="sr-only">Filter items</h2>
          <div className="bg-white dark:bg-[#1a2e22] rounded-2xl shadow-sm border border-gray-100 dark:border-[#2a4a35] p-4 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <select className={inputCls} value={filters.type} onChange={(e) => handleFilter('type', e.target.value)}>
                <option value="">All Types</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
              <select className={inputCls} value={filters.category} onChange={(e) => handleFilter('category', e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input className={`${inputCls} col-span-2 md:col-span-1`}
                placeholder="Search keyword..." value={filters.keyword}
                onChange={(e) => handleFilter('keyword', e.target.value)} />
              <div className="flex gap-2">
                <input className={`${inputCls} flex-1`}
                  placeholder="Location..." value={filters.location}
                  onChange={(e) => handleFilter('location', e.target.value)} />
                {hasFilters && (
                  <button onClick={clearFilters}
                    className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-[#2a4a35] text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3a5a45] text-xs font-semibold transition">
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Items grid — each card is an <article> inside a <section> */}
        <section aria-labelledby="items-heading">
          <h2 id="items-heading" className="sr-only">Item listings</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#1a2e22] rounded-2xl shadow-sm border border-gray-100 dark:border-[#2a4a35] overflow-hidden animate-pulse">
                  <div className="w-full h-44 bg-gray-200 dark:bg-[#2a4a35]" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-[#2a4a35] rounded w-1/2" />
                    <div className="h-4 bg-gray-200 dark:bg-[#2a4a35] rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-[#2a4a35] rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="text-6xl mb-4">🔎</p>
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No items found</p>
              <p className="text-sm mt-1 dark:text-gray-500">Try adjusting your filters or be the first to post!</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{items.length} item{items.length !== 1 ? 's' : ''} found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {items.map((item) => (
                  /* each listing is an <article> — independent, self-contained content */
                  <article key={item._id}>
                    <ItemCard item={item} />
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
