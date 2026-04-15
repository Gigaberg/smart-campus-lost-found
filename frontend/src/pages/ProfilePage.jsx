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

  const fetchMyItems = () => {
    api.get('/items').then((res) => {
      const mine = res.data.items.filter((i) => i.postedBy._id === user._id);
      setItems(mine);
    }).catch(() => toast.error('Failed to load your items'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMyItems(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(`/items/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 dark:bg-[#0f1f17] min-h-screen">
      {/* Profile header */}
      <div className="bg-white dark:bg-[#1a2e22] rounded-2xl shadow-md border border-gray-100 dark:border-[#2a4a35] p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1a3a2a] text-white flex items-center justify-center text-2xl font-extrabold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#1a3a2a] dark:text-white">{user.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
        <Link to="/items/new"
          className="bg-amber-400 text-[#1a3a2a] px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-300 transition">
          + Post Item
        </Link>
      </div>

      <h2 className="text-lg font-bold text-[#1a3a2a] dark:text-white mb-4">My Listings</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#1a2e22] rounded-2xl overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-200 dark:bg-[#2a4a35]" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-[#2a4a35] rounded w-1/2" />
                <div className="h-4 bg-gray-200 dark:bg-[#2a4a35] rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-6xl mb-4">📋</p>
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No listings yet</p>
          <p className="text-sm mt-1 dark:text-gray-500">Post a lost or found item to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item._id}>
              <ItemCard item={item} />
              <div className="flex gap-2 mt-2">
                <Link to={`/items/${item._id}/edit`}
                  className="flex-1 text-center text-xs bg-white dark:bg-[#1a2e22] border border-gray-200 dark:border-[#2a4a35] text-gray-700 dark:text-gray-300 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2a4a35] font-semibold transition">
                  ✏️ Edit
                </Link>
                <button onClick={() => handleDelete(item._id)}
                  className="flex-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 font-semibold transition">
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
