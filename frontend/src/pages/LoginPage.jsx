import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      login(res.data.token, res.data.user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  const inputCls = "w-full border border-gray-200 dark:border-[#2a4a35] rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-[#1a2e22] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/30 dark:focus:ring-amber-400/30 transition text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f5f0] dark:bg-[#0f1f17] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🎓</span>
          <h2 className="text-2xl font-extrabold text-[#1a3a2a] dark:text-white mt-3">Welcome back</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to your account</p>
        </div>
        <div className="bg-white dark:bg-[#1a2e22] rounded-2xl shadow-md border border-gray-100 dark:border-[#2a4a35] p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input type="email" className={inputCls} placeholder="you@university.edu"
                {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <input type="password" className={inputCls} placeholder="••••••••"
                {...register('password', { required: 'Password is required' })} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full bg-[#1a3a2a] text-white py-3 rounded-xl font-bold hover:bg-[#122a1e] disabled:opacity-50 transition mt-2">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          No account?{' '}
          <Link to="/register" className="text-[#1a3a2a] dark:text-amber-400 font-semibold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
