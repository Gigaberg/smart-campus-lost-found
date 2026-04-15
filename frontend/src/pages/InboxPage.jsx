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
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-3 dark:bg-[#0f1f17] min-h-screen">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-[#1a2e22] rounded-2xl p-4 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-[#2a4a35] rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-[#2a4a35] rounded w-2/3" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 dark:bg-[#0f1f17] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1a3a2a] dark:text-white">Inbox</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-6xl mb-4">📭</p>
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No messages yet</p>
          <p className="text-sm mt-1 dark:text-gray-500">When someone contacts you about an item, it'll show up here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg._id} onClick={() => !msg.read && markRead(msg._id)}
              className={`bg-white dark:bg-[#1a2e22] rounded-2xl border p-5 cursor-pointer transition hover:shadow-md ${
                !msg.read
                  ? 'border-l-4 border-l-amber-400 border-gray-100 dark:border-[#2a4a35]'
                  : 'border-gray-100 dark:border-[#2a4a35] opacity-75'
              }`}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#1a3a2a]/10 dark:bg-amber-400/10 text-[#1a3a2a] dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                    {msg.sender.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{msg.sender.name}</span>
                  {!msg.read && <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>}
                </div>
                <span className="text-xs text-gray-400 shrink-0">{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-xs text-[#1a3a2a] dark:text-amber-400 font-medium mb-2 ml-10">
                Re:{' '}
                <Link to={`/items/${msg.itemId?._id}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
                  {msg.itemId?.title || 'Deleted item'}
                </Link>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 ml-10">{msg.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InboxPage;
