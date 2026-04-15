import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Accessories', 'Keys', 'ID/Cards', 'Bags', 'Other'];

const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

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
        if (k === 'image') { if (v[0]) formData.append('image', v[0]); }
        else formData.append(k, v);
      });
      await api.put(`/items/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Item updated!');
      navigate(`/items/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Item</h1>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('category', { required: 'Required' })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              {...register('description', { required: 'Description is required' })} />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('location', { required: 'Location is required' })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('date', { required: 'Date is required' })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Replace Image (optional)</label>
            <input type="file" accept="image/jpeg,image/png,image/webp" className="w-full text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700"
              {...register('image')} />
          </div>
          <button type="submit" disabled={isSubmitting}
            className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditItemPage;
