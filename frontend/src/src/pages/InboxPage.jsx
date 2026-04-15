import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const InboxPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/messages/inbox')
      .then((res) => setMessages(res.data.messages))
      .catch(() => toast.error('Failed to load inbox'))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/messages/${id}/read`);
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, read: true } : m));
    } catch { /* silent */ }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Inbox</h1>
        {unreadCount > 0 && (
          <span className="bg-fuchsia-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {unreadCount} new
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-600 font-semibold">Your inbox is empty</p>
          <p className="text-sm text-gray-400 mt-1">Messages from other users will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg._id}
              onClick={() => !msg.read && markRead(msg._id)}
              className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer transition hover:shadow-md ${!msg.read ? 'border-violet-200 border-l-4 border-l-violet-500' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {msg.sender.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{msg.sender.name}</p>
                    <p className="text-xs text-violet-600 mt-0.5">
                      Re:{' '}
                      <Link to={`/items/${msg.itemId?._id}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
                        {msg.itemId?.title || 'Deleted item'}
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  {!msg.read && <span className="text-xs text-fuchsia-500 font-bold">● Unread</span>}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">{msg.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InboxPage;
