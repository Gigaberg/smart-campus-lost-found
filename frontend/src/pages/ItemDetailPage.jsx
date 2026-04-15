import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';

const statusStyles = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  recovered: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  claimed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

const ItemDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msgBody, setMsgBody] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get(`/items/${id}`)
      .then((res) => setItem(res.data.item))
      .catch(() => toast.error('Item not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(`/items/${id}`);
      toast.success('Item deleted');
      navigate('/');
    } catch { toast.error('Failed to delete'); }
  };

  const handleStatus = async (status) => {
    try {
      const res = await api.patch(`/items/${id}/status`, { status });
      setItem(res.data.item);
      toast.success(`Marked as ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgBody.trim()) return;
    setSending(true);
    try {
      await api.post('/messages', { itemId: id, body: msgBody });
      toast.success('Message sent!');
      setMsgBody('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send');
    } finally { setSending(false); }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse dark:bg-[#0f1f17] min-h-screen">
      <div className="bg-white dark:bg-[#1a2e22] rounded-2xl shadow-md overflow-hidden">
        <div className="w-full h-72 bg-gray-200 dark:bg-[#2a4a35]" />
        <div className="p-6 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-[#2a4a35] rounded w-1/4" />
          <div className="h-6 bg-gray-200 dark:bg-[#2a4a35] rounded w-2/3" />
          <div className="h-4 bg-gray-200 dark:bg-[#2a4a35] rounded w-full" />
        </div>
      </div>
    </div>
  );

  if (!item) return (
    <div className="text-center py-24 text-gray-400 dark:bg-[#0f1f17] min-h-screen">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-lg font-medium">Item not found.</p>
    </div>
  );

  const isOwner = user && item.postedBy._id === user._id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 dark:bg-[#0f1f17] min-h-screen">
      {/* article — self-contained item listing content */}
      <article className="bg-white dark:bg-[#1a2e22] rounded-2xl shadow-md border border-gray-100 dark:border-[#2a4a35] overflow-hidden">
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.title} className="w-full max-h-80 object-cover" />
        )}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.type === 'lost' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'}`}>
              {item.type.toUpperCase()}
            </span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[item.status]}`}>
              {item.status}
            </span>
            <span className="text-xs text-gray-400 ml-auto">{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>

          <h1 className="text-2xl font-extrabold text-[#1a3a2a] dark:text-white mb-2">{item.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{item.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300 mb-6 bg-gray-50 dark:bg-[#0f1f17] rounded-xl p-4">
            <div className="flex items-center gap-2"><span>📍</span><span><strong>Location:</strong> {item.location}</span></div>
            <div className="flex items-center gap-2"><span>🏷</span><span><strong>Category:</strong> {item.category}</span></div>
            <div className="flex items-center gap-2"><span>📅</span><span><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</span></div>
            <div className="flex items-center gap-2"><span>👤</span><span><strong>Posted by:</strong> {item.postedBy.name}</span></div>
          </div>

          {isOwner && (
            <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-100 dark:border-[#2a4a35]">
              <Link to={`/items/${id}/edit`}
                className="bg-gray-100 dark:bg-[#2a4a35] text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-[#3a5a45] transition">
                ✏️ Edit
              </Link>
              <button onClick={handleDelete}
                className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                🗑 Delete
              </button>
              {item.status === 'active' && (
                <button onClick={() => handleStatus(item.type === 'lost' ? 'recovered' : 'claimed')}
                  className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition">
                  ✅ Mark as {item.type === 'lost' ? 'Recovered' : 'Claimed'}
                </button>
              )}
              {item.status !== 'active' && (
                <button onClick={() => handleStatus('active')}
                  className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition">
                  🔄 Reopen
                </button>
              )}
            </div>
          )}

          {user && !isOwner && item.status === 'active' && (
            <div className="mb-2">
              <h3 className="font-bold text-[#1a3a2a] dark:text-white mb-3">💬 Contact Poster</h3>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <textarea
                  className="flex-1 border border-gray-200 dark:border-[#2a4a35] rounded-xl px-4 py-2.5 text-sm resize-none bg-gray-50 dark:bg-[#0f1f17] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/30 dark:focus:ring-amber-400/30 transition"
                  rows={2} placeholder="Write your message..." value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)} />
                <button type="submit" disabled={sending}
                  className="bg-[#1a3a2a] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#122a1e] disabled:opacity-50 transition self-end">
                  {sending ? '...' : 'Send'}
                </button>
              </form>
            </div>
          )}

          {!user && (
            <p className="text-sm text-gray-500 dark:text-gray-400 pt-2">
              <Link to="/login" className="text-[#1a3a2a] dark:text-amber-400 font-semibold hover:underline">Sign in</Link> to contact the poster.
            </p>
          )}
        </div>
      </article>

      {item.matches?.length > 0 && (
        <aside className="mt-10" aria-labelledby="matches-heading">
          <h2 id="matches-heading" className="text-lg font-bold text-[#1a3a2a] dark:text-white mb-4">🔗 Potential Matches</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {item.matches.map((m) => <ItemCard key={m._id} item={m} />)}
          </div>
        </aside>
      )}
    </div>
  );
};

export default ItemDetailPage;
