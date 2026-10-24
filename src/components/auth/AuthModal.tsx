import React, { useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { auth } from '../../services/auth';
import { X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  onClose,
  onSuccess
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'forgot') {
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      setResetSent(true);
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please provide your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password should be at least 6 characters.');
        return;
      }

      setLoading(true);
      try {
        await auth.register(name, email, password);
        onSuccess();
        onClose();
      } catch (err: any) {
        setError(err.message || 'Registration failed.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        await auth.login(email, password);
        onSuccess();
        onClose();
      } catch (err: any) {
        setError(err.message || 'Sign in failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDemoFill = (role: 'student' | 'instructor' | 'admin') => {
    auth.switchDemoUser(role);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-[#090f1e] border border-slate-700 p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Lockup */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-display font-black text-white text-xs">
            AS
          </div>
          <span className="text-base font-bold text-white">
            Abdala <span className="text-blue-500 font-medium">Silver</span>
          </span>
        </div>

        <h2 className="text-xl font-bold font-display text-white mb-1">
          {mode === 'login' && t.auth.loginTitle}
          {mode === 'register' && t.auth.registerTitle}
          {mode === 'forgot' && t.auth.forgotPasswordTitle}
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          {mode === 'login' && 'Enter your credentials to continue your creative journey.'}
          {mode === 'register' && 'Join thousands of Somali and international creators.'}
          {mode === 'forgot' && 'Enter your registered email to receive password reset instructions.'}
        </p>

        {/* Quick 1-Click Demo Accounts */}
        <div className="mb-6 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2 font-medium">
            <span className="flex items-center gap-1.5 text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.auth.quickDemoRoles}</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoFill('student')}
              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-blue-600/30 hover:border-blue-500 border border-slate-700 text-[11px] font-semibold text-slate-200 transition-all cursor-pointer"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('instructor')}
              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-blue-600/30 hover:border-blue-500 border border-slate-700 text-[11px] font-semibold text-slate-200 transition-all cursor-pointer"
            >
              Instructor
            </button>
            <button
              type="button"
              onClick={() => {
                auth.login('cadkajwhr5@gmail.com');
                onSuccess();
                onClose();
              }}
              className="py-1.5 px-2 rounded-lg bg-blue-950/70 hover:bg-blue-600/40 border border-blue-500/80 text-[11px] font-bold text-blue-300 transition-all cursor-pointer shadow-sm"
              title="cadkajwhr5@gmail.com"
            >
              My Admin
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 text-center">
            Super Admin account: <span className="text-blue-400 font-mono">cadkajwhr5@gmail.com</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetSent ? (
          <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs text-center space-y-3">
            <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
            <p>Password reset link has been dispatched to <strong>{email}</strong>.</p>
            <button
              onClick={() => {
                setResetSent(false);
                setMode('login');
              }}
              className="text-blue-400 font-semibold underline text-xs"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <div>
                <label className="block text-slate-400 font-medium mb-1">{t.auth.fullName}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Liban Hassan"
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-400 font-medium mb-1">{t.auth.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-medium">{t.auth.password}</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-blue-400 hover:text-blue-300"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-slate-400 font-medium mb-1">{t.auth.confirmPassword}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              {loading ? 'Processing...' : (
                mode === 'login' ? t.auth.submitLogin :
                mode === 'register' ? t.auth.submitRegister :
                t.auth.sendReset
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              {t.auth.dontHaveAccount}{' '}
              <button
                onClick={() => {
                  setError('');
                  setMode('register');
                }}
                className="text-blue-400 font-semibold hover:underline"
              >
                Register
              </button>
            </p>
          ) : (
            <p>
              {t.auth.alreadyHaveAccount}{' '}
              <button
                onClick={() => {
                  setError('');
                  setMode('login');
                }}
                className="text-blue-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
