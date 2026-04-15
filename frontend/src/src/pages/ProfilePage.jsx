import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';

const ProfilePage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    api.get('/items').then((res) => {
      const mine = res.data.items.filter((i) => i.postedBy._id === user._id);
      setItems(mine);
    }).catch(() => toast.error('Failed to load your items'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(`/items/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = tab === 'all' ? items : items.filter((i) => i.type === tab);
  const lostCount = items.filter((i) => i.type === 'lost').length;
  const foundCount = items.filter((i) => i.type === 'found').length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile header */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-2xl p-6 md:p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-extrabold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">{user.name}</h1>
            <p className="text-white/70 text-sm">{user.email}</p>
          </div>
          <Link to="/items/new"
            className="ml-auto bg-white text-violet-700 font-bold px-4 py-2 rounded-xl text-sm shadow hover:shadow-md hover:-translate-y-0.5 transition-all">
            + Post Item
          </Link>
        </div>
        <div className="flex gap-6 mt-6">
          <div><div className="text-2xl font-extrabold">{items.length}</div><div className="text-xs text-white/70">Total Posts</div></div>
          <div><div className="text-2xl font-extrabold">{lostCount}</div><div className="text-xs text-white/70">Lost</div></div>
          <div><div className="text-2xl font-extrabold">{foundCount}</div><div className="text-xs text-white/70">Found</div></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[['all', 'All'], ['lost', '🔍 Lost'], ['found', '📦 Found']].map(([val, label]) => (
          <button key={val} onClick={() => setTab(val)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === val ? 'bg-violet-600 text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-600 font-semibold">No items here yet</p>
          <Link to="/items/new" className="text-sm text-violet-600 hover:underline mt-2 inline-block">Post your first item →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div key={item._id}>
              <ItemCard item={item} />
              <div className="flex gap-2 mt-2">
                <Link to={`/items/${item._id}/edit`}
                  className="flex-1 text-center text-xs bg-white border border-gray-200 text-gray-700 py-1.5 rounded-xl hover:border-violet-300 transition font-medium">
                  ✏️ Edit
                </Link>
                <button onClick={() => handleDelete(item._id)}
                  className="flex-1 text-xs bg-white border border-gray-200 text-red-500 py-1.5 rounded-xl hover:border-red-300 transition font-medium">
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
