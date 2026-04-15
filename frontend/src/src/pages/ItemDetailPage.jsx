import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  recovered: 'bg-gray-100 text-gray-500',
  claimed: 'bg-gray-100 text-gray-500',
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!item) return <div className="text-center py-20 text-gray-400">Item not found.</div>;

  const isOwner = user && item.postedBy._id === user._id;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-violet-600">Home</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate">{item.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} className="w-full h-80 object-cover" />
          ) : (
            <div className="w-full h-80 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <span className="text-8xl">
                {item.type === 'lost' ? '🔍' : '📦'}
              </span>
              <span className="text-gray-400 mt-3 text-sm">No image provided</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-violet-100 text-violet-600'}`}>
              {item.type === 'lost' ? '🔍 LOST' : '📦 FOUND'}
            </span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[item.status]}`}>
              {item.status}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-3">{item.title}</h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-5">{item.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: '📍', label: 'Location', value: item.location },
              { icon: '🏷', label: 'Category', value: item.category },
              { icon: '📅', label: 'Date', value: new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
              { icon: '👤', label: 'Posted by', value: item.postedBy.name },
            ].map((d) => (
              <div key={d.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="text-xs text-gray-400 mb-0.5">{d.icon} {d.label}</div>
                <div className="text-sm font-semibold text-gray-800">{d.value}</div>
              </div>
            ))}
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="flex flex-wrap gap-2 mb-5">
              <Link to={`/items/${id}/edit`}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
                ✏️ Edit
              </Link>
              <button onClick={handleDelete}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition">
                🗑 Delete
              </button>
              {item.status === 'active' && (
                <button onClick={() => handleStatus(item.type === 'lost' ? 'recovered' : 'claimed')}
                  className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition">
                  ✅ Mark as {item.type === 'lost' ? 'Recovered' : 'Claimed'}
                </button>
              )}
              {item.status !== 'active' && (
                <button onClick={() => handleStatus('active')}
                  className="bg-violet-50 text-violet-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-violet-100 transition">
                  🔄 Reopen
                </button>
              )}
            </div>
          )}

          {/* Contact form */}
          {user && !isOwner && item.status === 'active' && (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">💬 Contact Poster</h3>
              <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                <textarea
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                  rows={3} placeholder="Describe how you can identify the item or arrange pickup..."
                  value={msgBody} onChange={(e) => setMsgBody(e.target.value)} />
                <button type="submit" disabled={sending}
                  className="self-end bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition">
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          )}

          {!user && (
            <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100 text-sm text-violet-700">
              <Link to="/login" className="font-bold hover:underline">Sign in</Link> to contact the poster about this item.
            </div>
          )}
        </div>
      </div>

      {/* Matches */}
      {item.matches?.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-gray-100" />
            <h2 className="text-lg font-bold text-gray-700 whitespace-nowrap">🔗 Potential Matches</h2>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {item.matches.map((m) => <ItemCard key={m._id} item={m} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailPage;
