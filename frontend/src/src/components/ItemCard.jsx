import { Link } from 'react-router-dom';

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  recovered: 'bg-gray-100 text-gray-500',
  claimed: 'bg-gray-100 text-gray-500',
};

const typeColors = {
  lost: 'bg-red-100 text-red-600',
  found: 'bg-violet-100 text-violet-600',
};

const categoryEmoji = {
  Electronics: '💻', Clothing: '👕', Books: '📚', Accessories: '👜',
  Keys: '🔑', 'ID/Cards': '🪪', Bags: '🎒', Other: '📦',
};

const ItemCard = ({ item }) => {
  const { _id, title, type, category, location, date, imageUrl, status } = item;

  return (
    <Link to={`/items/${_id}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100">
      {/* Image */}
      <div className="relative overflow-hidden h-44 bg-gray-50">
        {imageUrl ? (
          <img src={imageUrl} alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <span className="text-5xl">{categoryEmoji[category] || '📦'}</span>
            <span className="text-xs text-gray-400 mt-2">{category}</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${typeColors[type]}`}>
            {type === 'lost' ? '🔍 LOST' : '📦 FOUND'}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[status]}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate text-sm">{title}</h3>
        <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{location}</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span className="text-xs font-medium text-violet-600 group-hover:underline">View →</span>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
