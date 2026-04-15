import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/register', data);
      login(res.data.token, res.data.user);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left image panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=1000&fit=crop"
          alt="campus" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-700/80 to-violet-600/60 flex flex-col justify-end p-12">
          <h2 className="text-4xl font-extrabold text-white mb-3">Join the community.</h2>
          <p className="text-white/80 text-lg">Help your fellow students recover their lost belongings.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-fuchsia-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">L</div>
            <span className="font-bold text-gray-900 text-lg">Lost<span className="text-violet-600">&</span>Found</span>
          </Link>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-500 mb-8 text-sm">Join the campus lost & found community</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input placeholder="Your full name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                {...register('name', { required: 'Name is required' })} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
              <input type="email" placeholder="you@university.edu"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input type="password" placeholder="Min. 6 characters"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Student / Staff ID <span className="text-gray-400 font-normal">(optional)</span></label>
              <input placeholder="e.g. STU2024001"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                {...register('studentId')} />
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:opacity-90 disabled:opacity-50 transition mt-2">
              {isSubmitting ? 'Creating...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
