import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import api from '../api/axios';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Accessories', 'Keys', 'ID/Cards', 'Bags', 'Other'];

const CreateItemPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === 'image') { if (v[0]) formData.append('image', v[0]); }
        else formData.append(k, v);
      });
      const res = await api.post('/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Item posted!');
      navigate(`/items/${res.data.item._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post item');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Post an Item</h1>
          <p className="text-gray-500 mt-1 text-sm">Fill in the details to help others identify your item</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Type & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">I am posting a...</label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50"
                  {...register('type', { required: true })}>
                  <option value="lost">🔍 Lost Item</option>
                  <option value="found">📦 Found Item</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50"
                  {...register('category', { required: true })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
              <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50"
                placeholder="e.g. Blue Nike water bottle"
                {...register('title', { required: 'Title is required' })} />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50 resize-none"
                placeholder="Describe the item — color, brand, distinguishing features..."
                {...register('description', { required: 'Description is required' })} />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            {/* Location & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50"
                  placeholder="e.g. Library, Block A"
                  {...register('location', { required: 'Location is required' })} />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50"
                  {...register('date', { required: 'Date is required' })} />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Photo <span className="text-gray-400 font-normal">(optional)</span></label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-violet-400 transition cursor-pointer bg-gray-50">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-lg mx-auto" />
                ) : (
                  <div className="py-4">
                    <div className="text-3xl mb-2">📷</div>
                    <p className="text-sm text-gray-500">Click to upload a photo</p>
                    <p className="text-xs text-gray-400 mt-1">JPEG, PNG or WebP · Max 5MB</p>
                  </div>
                )}
                <input type="file" accept="image/jpeg,image/png,image/webp"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  style={{ position: 'relative' }}
                  {...register('image')}
                  onChange={(e) => { register('image').onChange(e); handleImageChange(e); }} />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:opacity-90 disabled:opacity-50 transition">
              {isSubmitting ? 'Posting...' : '🚀 Post Item'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateItemPage;
