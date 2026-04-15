import { Link } from 'react-router-dom';

const statusStyles = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  recovered: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  claimed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

const ItemCard = ({ item }) => {
  const { _id, title, type, category, location, date, imageUrl, status } = item;

  return (
    <Link to={`/items/${_id}`} className="group block bg-white dark:bg-[#1a2e22] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 dark:border-[#2a4a35]">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
      ) : (
        <div className="w-full h-44 bg-gradient-to-br from-[#1a3a2a]/10 to-amber-50 dark:from-[#1a3a2a]/40 dark:to-[#0f1f17] flex items-center justify-center text-5xl">
          {type === 'lost' ? '🔍' : '📦'}
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${type === 'lost' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'}`}>
            {type.toUpperCase()}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[status]}`}>
            {status}
          </span>
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate text-sm mt-1">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1">
          <span>📍</span> {location}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
          <span>🏷</span> {category} · {new Date(date).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
};

export default ItemCard;
