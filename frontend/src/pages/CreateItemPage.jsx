import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useImageUpload } from '../hooks/useImageUpload';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Accessories', 'Keys', 'ID/Cards', 'Bags', 'Other'];

const inputCls = "w-full border border-gray-200 dark:border-[#2a4a35] rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-[#1a2e22] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/30 dark:focus:ring-amber-400/30 transition text-sm";
const labelCls = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

const CreateItemPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const { preview, converting, file, handleImageChange } = useImageUpload();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k !== 'image') formData.append(k, v);
      });
      if (file) formData.append('image', file);

      const res = await api.post('/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Item posted!');
      navigate(`/items/${res.data.item._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post item');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 dark:bg-[#0f1f17] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#1a3a2a] dark:text-white">Post an Item</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Fill in the details to help others find or return the item.</p>
      </div>
      <div className="bg-white dark:bg-[#1a2e22] rounded-2xl shadow-md border border-gray-100 dark:border-[#2a4a35] p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls} {...register('type', { required: 'Required' })}>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select className={inputCls} {...register('category', { required: 'Required' })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Title</label>
            <input className={inputCls} placeholder="e.g. Blue water bottle"
              {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={3} className={`${inputCls} resize-none`}
              placeholder="Describe the item in detail — color, brand, distinguishing features..."
              {...register('description', { required: 'Description is required' })} />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Location</label>
              <input className={inputCls} placeholder="e.g. Library, Block A"
                {...register('location', { required: 'Location is required' })} />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" className={inputCls} {...register('date', { required: 'Date is required' })} />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
            </div>
          </div>

          {/* Image upload with HEIC support */}
          <div>
            <label className={labelCls}>Image <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1a3a2a]/10 dark:file:bg-amber-400/10 file:text-[#1a3a2a] dark:file:text-amber-400 file:font-semibold hover:file:bg-[#1a3a2a]/20 transition"
            />
            {converting && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1">
                <span className="animate-spin inline-block">⏳</span> Converting HEIC image...
              </p>
            )}
            {preview && !converting && (
              <img src={preview} alt="Preview" className="mt-3 rounded-xl w-full max-h-48 object-cover border border-gray-200 dark:border-[#2a4a35]" />
            )}
          </div>

          <button type="submit" disabled={isSubmitting || converting}
            className="w-full bg-[#1a3a2a] text-white py-3 rounded-xl font-bold hover:bg-[#122a1e] disabled:opacity-50 transition">
            {isSubmitting ? 'Posting...' : 'Post Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateItemPage;
