import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2, Apple } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address').max(255, 'Email too long'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters').max(128, 'Password too long'),
});

type FieldErrors = Partial<Record<'email' | 'password', string>>;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateField = (field: 'email' | 'password', value: string) => {
    const partial = field === 'email' ? { email: value, password: 'x'.repeat(6) } : { email: 'a@b.com', password: value };
    const result = loginSchema.safeParse(partial);
    if (result.success) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    } else {
      const err = result.error.issues.find(i => i.path[0] === field);
      setFieldErrors(prev => ({ ...prev, [field]: err?.message }));
    }
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, field === 'email' ? email : password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errs: FieldErrors = {};
      result.error.issues.forEach(i => { errs[i.path[0] as 'email' | 'password'] = i.message; });
      setFieldErrors(errs);
      setTouched({ email: true, password: true });
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials. Try a demo account below.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    setError(`OAuth with ${provider} requires backend integration.`);
  };

  const demoAccounts = [
    { label: 'Admin', email: 'admin@infosys.com', role: 'ADMIN' },
    { label: 'Manager', email: 'manager@infosys.com', role: 'PROCUREMENT_MANAGER' },
    { label: 'Vendor', email: 'vendor@company.com', role: 'VENDOR' },
    { label: 'Compliance', email: 'compliance@infosys.com', role: 'COMPLIANCE_OFFICER' },
  ];

  const inputClass = (hasError: boolean) =>
    `w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
      hasError ? 'border-destructive focus:ring-destructive/40' : 'border-input focus:ring-ring'
    }`;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: 'var(--gradient-primary)' }}>
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full border border-primary-foreground/20"
              style={{ width: 200 + i * 150, height: 200 + i * 150, top: '50%', left: '50%', x: '-50%', y: '-50%' }}
              animate={{ rotate: 360 }} transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }} />
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="relative z-10 text-center px-12">
          <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="w-20 h-20 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <span className="text-3xl font-bold text-primary-foreground">V</span>
          </motion.div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Smart VMS</h1>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Vendor & Procurement Management — streamline your entire procurement lifecycle with JWT-secured access.
          </p>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center text-primary-foreground font-bold text-xl"
              style={{ background: 'var(--gradient-primary)' }}>V</div>
            <h1 className="text-2xl font-bold text-foreground">Smart VMS</h1>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground mb-6">Sign in with your credentials or OAuth provider</p>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: () => <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>, label: 'Google', provider: 'Google' },
              { icon: () => <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>, label: 'GitHub', provider: 'GitHub' },
              { icon: Apple, label: 'Apple', provider: 'Apple' },
            ].map(({ icon: Icon, label, provider }) => (
              <motion.button key={provider} whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleOAuth(provider)} type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border bg-secondary/50 text-foreground hover:bg-secondary transition-all text-sm font-medium">
                <Icon size={18} />
                <span className="hidden sm:inline">{label}</span>
              </motion.button>
            ))}
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-3 text-muted-foreground uppercase tracking-wider">or sign in with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type="email" value={email}
                  onChange={e => { setEmail(e.target.value); if (touched.email) validateField('email', e.target.value); }}
                  onBlur={() => handleBlur('email')} required
                  className={inputClass(!!fieldErrors.email && !!touched.email)}
                  placeholder="you@company.com" />
              </div>
              <AnimatePresence>
                {touched.email && fieldErrors.email && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {fieldErrors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-foreground">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => { setPassword(e.target.value); if (touched.password) validateField('password', e.target.value); }}
                  onBlur={() => handleBlur('password')} required
                  className={`${inputClass(!!fieldErrors.password && !!touched.password)} pr-10`}
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <AnimatePresence>
                {touched.password && fieldErrors.password && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {fieldErrors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-primary-foreground transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'var(--gradient-primary)' }}>
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Create account</Link>
          </p>

          {/* Demo accounts */}
          <div className="mt-6">
            <p className="text-xs text-muted-foreground mb-3">Demo accounts (any password ≥6 chars):</p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map(acc => (
                <motion.button key={acc.email} whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setEmail(acc.email); setPassword('demo123'); setFieldErrors({}); setTouched({}); }}
                  className="text-xs px-3 py-2 rounded-lg border border-border bg-secondary/50 text-foreground hover:bg-secondary transition-colors text-left">
                  <span className="font-medium">{acc.label}</span>
                  <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{acc.role}</span>
                  <br /><span className="text-muted-foreground">{acc.email}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
