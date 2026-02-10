import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { authAPI } from '@/api/client';
import { useAuthStore } from '@/store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const loginMutation = useMutation(authAPI.login, {
    onSuccess: async (response) => {
      const { access, refresh } = response.data;
      
      // Set tokens in localStorage first so axios interceptor can use them
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Now get user profile with token in headers
      const profileResponse = await authAPI.getProfile();
      const user = profileResponse.data;
      
      setAuth(user, access, refresh);
      toast.success('Login successful!');
      
      // Redirect based on role
      if (user.role === 'STUDENT') {
        navigate('/student');
      } else if (user.role === 'CHECKER') {
        navigate('/checker');
      } else if (user.role === 'ADMIN') {
        navigate('/admin');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Login failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign in to your account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="input mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loginMutation.isLoading}
            className="btn-primary w-full"
          >
            {loginMutation.isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link to="/register" className="text-sm text-primary-600 hover:text-primary-500">
          Don't have an account? Register
        </Link>
      </div>
    </div>
  );
}
