import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useImageUpload } from '../hooks/useImageUpload';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Accessories', 'Keys', 'ID/Cards', 'Bags', 'Other'];

const inputCls = "w-full border border-gray-200 dark:border-[#2a4a35] rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-[#1a2e22] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/30 dark:focus:ring-amber-400/30 transition text-sm";
const labelCls = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { preview, converting, file, handleImageChange } = useImageUpload();

  useEffect(() => {
    api.get(`/items/${id}`).then((res) => {
      const { title, description, category, location, date } = res.data.item;
      reset({ title, description, category, location, date: date?.slice(0, 10) });
    }).catch(() => toast.error('Failed to load item'));
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k !== 'image') formData.append(k, v);
      });
      if (file) formData.append('image', file);

      await api.put(`/items/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Item updated!');
      navigate(`/items/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 dark:bg-[#0f1f17] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#1a3a2a] dark:text-white">Edit Item</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Update the details for this listing.</p>
      </div>
      <div className="bg-white dark:bg-[#1a2e22] rounded-2xl shadow-md border border-gray-100 dark:border-[#2a4a35] p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className={labelCls}>Category</label>
            <select className={inputCls} {...register('category', { required: 'Required' })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className={labelCls}>Title</label>
            <input className={inputCls} {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={3} className={`${inputCls} resize-none`}
              {...register('description', { required: 'Description is required' })} />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Location</label>
              <input className={inputCls} {...register('location', { required: 'Location is required' })} />
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" className={inputCls} {...register('date', { required: 'Date is required' })} />
            </div>
          </div>

          {/* Image upload with HEIC support */}
          <div>
            <label className={labelCls}>Replace Image <span className="text-gray-400 font-normal">(optional)</span></label>
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditItemPage;
