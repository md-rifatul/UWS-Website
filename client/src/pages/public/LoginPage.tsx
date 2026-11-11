import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Mail, Lock, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setCredentials, setError, setLoading } from '@/features/auth/authSlice';
import { authService } from '@/services/authService';
import Button from '@/components/common/Button';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please provide both corporate email and password.');
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);

    try {
      const response = await authService.login(email, password);
      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.accessToken,
        })
      );
      if (response.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setLocalError(err?.response?.data?.message || 'Invalid credentials. Please verify your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = (role: 'Admin' | 'Buyer') => {
    if (role === 'Admin') {
      setEmail('admin@woodtech.com');
      setPassword('Admin@123456');
    } else {
      setEmail('buyer@apexwoodcraft.com');
      setPassword('Buyer@123456');
    }
  };

  return (
    <div className="bg-surface-offwhite min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-border p-8 shadow-premium space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center mx-auto text-industrial-orange shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-900">Corporate Portal Sign In</h2>
          <p className="text-xs text-slate-500">
            Access proforma quotes, active RFQ status, and administrative tools.
          </p>
        </div>

        {localError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{localError}</span>
          </div>
        )}

        {/* Demo Fast Login Pills */}
        <div className="p-3 bg-surface-offwhite rounded-lg border border-slate-border space-y-2">
          <span className="text-[11px] font-semibold text-slate-muted uppercase tracking-wider block">
            Demo Credentials Pre-fill:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Admin')}
              className="text-xs font-semibold py-1.5 px-2.5 bg-white border border-slate-border hover:border-industrial-orange text-navy-900 rounded text-center transition-colors shadow-2xs"
            >
              Sign in as Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Buyer')}
              className="text-xs font-semibold py-1.5 px-2.5 bg-white border border-slate-border hover:border-industrial-orange text-navy-900 rounded text-center transition-colors shadow-2xs"
            >
              Sign in as Buyer
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Corporate Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-charcoal-700 uppercase">
                Password
              </label>
              <a href="#reset" className="text-[11px] text-industrial-orange hover:underline font-medium">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-md"
            isLoading={isSubmitting}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Sign In to Portal
          </Button>
        </form>

        <div className="pt-2 border-t border-slate-border text-center text-xs text-slate-500">
          <span>New corporate buyer? </span>
          <Link to="/register" className="font-semibold text-industrial-orange hover:underline">
            Register factory account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

