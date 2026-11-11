import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Building, User, Mail, Phone, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAppDispatch } from '@/features/hooks';
import { setCredentials } from '@/features/auth/authSlice';
import { authService } from '@/services/authService';
import Button from '@/components/common/Button';

export const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await authService.register({
        fullName: form.fullName,
        companyName: form.companyName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.accessToken,
        })
      );
      navigate('/products');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-offwhite min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-xl border border-slate-border p-8 shadow-premium space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center mx-auto text-industrial-orange shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-900">Corporate Account Registration</h2>
          <p className="text-xs text-slate-500">
            Create an enterprise buyer profile to save quotation baskets and track proformas.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Your Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Engr. Tariqul Islam"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Company / Factory Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Apex Woodcraft Ltd"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                />
                <Building className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Corporate Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="buyer@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Official Phone *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="+880 1711-000000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
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
            Create Factory Account
          </Button>
        </form>

        <div className="pt-2 border-t border-slate-border text-center text-xs text-slate-500">
          <span>Already have a corporate profile? </span>
          <Link to="/login" className="font-semibold text-industrial-orange hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

