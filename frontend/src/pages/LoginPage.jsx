import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Lock, Mail, AlertCircle, Sparkles, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(redirectPath, { replace: true });
      } else {
        setErrorMsg(res.message || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const demoEmail = role === 'admin' ? 'admin@imovies.com' : 'user@imovies.com';
      const demoPass = role === 'admin' ? 'admin123' : 'user123';
      const res = await login(demoEmail, demoPass);
      if (res.success) {
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Quick demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#0b0f19]">
      <div className="w-full max-w-md bg-gray-900/80 rounded-3xl p-8 border border-gray-800 shadow-2xl backdrop-blur-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-rose-900/30">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white font-heading">Welcome Back</h1>
          <p className="text-xs text-gray-400">
            Sign in to access your digital tickets and manage bookings
          </p>
        </div>

        {/* Quick Demo Login Shortcut Buttons */}
        <div className="p-3.5 rounded-2xl bg-gray-950/90 border border-gray-800/80 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block text-center">
            ⚡ One-Click Instant Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('user')}
              className="py-2 px-3 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700/80 text-gray-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              <User className="w-3.5 h-3.5 text-rose-400" />
              <span>Demo User</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('admin')}
              className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-gray-950 text-xs text-white rounded-xl pl-10 pr-4 py-3 border border-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-950 text-xs text-white rounded-xl pl-10 pr-4 py-3 border border-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs tracking-wide uppercase shadow-lg shadow-rose-900/30 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-rose-400 hover:underline font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
