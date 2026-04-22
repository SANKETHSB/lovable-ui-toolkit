import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, Loader2, CheckCircle2, Apple, ShieldCheck } from 'lucide-react';
import { z } from 'zod';
import type { UserRole } from '@/types';

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Full name is required').min(2, 'Name must be at least 2 characters').max(100, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address').max(255, 'Email too long'),
  password: z.string().min(1, 'Password is required').min(8, 'Minimum 8 characters')
    .regex(/[A-Z]/, 'Needs an uppercase letter')
    .regex(/[a-z]/, 'Needs a lowercase letter')
    .regex(/[0-9]/, 'Needs a number')
    .regex(/[^A-Za-z0-9]/, 'Needs a special character')
    .max(128, 'Password too long'),
  confirmPassword: z.string().min(1, 'Confirm your password'),
  role: z.enum(['ADMIN', 'PROCUREMENT_MANAGER', 'VENDOR', 'COMPLIANCE_OFFICER']).refine(Boolean, 'Select a role'),
}).refine(d => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type FormData = { name: string; email: string; password: string; confirmPassword: string; role: string };
type FieldErrors = Partial<Record<keyof FormData, string>>;

const passwordChecks = [
  { label: '8+ characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const roles: { value: UserRole; label: string; desc: string }[] = [
  { value: 'ADMIN', label: 'Admin', desc: 'Full system access' },
  { value: 'PROCUREMENT_MANAGER', label: 'Procurement Manager', desc: 'Manage RFQs, POs & vendors' },
  { value: 'VENDOR', label: 'Vendor', desc: 'Submit quotations & view POs' },
  { value: 'COMPLIANCE_OFFICER', label: 'Compliance Officer', desc: 'Audit & compliance monitoring' },
];

const RegisterPage = () => {
  const [form, setForm] = useState<FormData>({ name: '', email: '', password: '', confirmPassword: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => {
    const passed = passwordChecks.filter(c => c.test(form.password)).length;
    return passed;
  }, [form.password]);

  const strengthColor = passwordStrength <= 1 ? 'bg-destructive' : passwordStrength <= 3 ? 'bg-warning' : 'bg-success';

  const updateField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (touched[field]) validateField(field, { ...form, [field]: value });
  };

  const validateField = (field: keyof FormData, data: FormData) => {
    const result = registerSchema.safeParse(data);
    if (result.success) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    } else {
      const err = result.error.issues.find(i => i.path[0] === field);
      setFieldErrors(prev => ({ ...prev, [field]: err?.message }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, form);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const errs: FieldErrors = {};
      result.error.issues.forEach(i => { errs[i.path[0] as keyof FormData] = i.message; });
      setFieldErrors(errs);
      setTouched({ name: true, email: true, password: true, confirmPassword: true, role: true });
      return;
    }
    if (!agreed) { setError('You must agree to the terms and conditions.'); return; }
    setLoading(true);
    // Simulate registration
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    navigate('/login');
  };

  const handleOAuth = (provider: string) => {
    setError(`OAuth registration with ${provider} requires backend integration.`);
  };

  const inputClass = (field: keyof FormData) =>
    `w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
      touched[field] && fieldErrors[field] ? 'border-destructive focus:ring-destructive/40' : 'border-input focus:ring-ring'
    }`;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center"
        style={{ background: 'var(--gradient-primary)' }}>
        <div className="absolute inset-0 opacity-10">
          {[...Array(4)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full border border-primary-foreground/20"
              style={{ width: 180 + i * 140, height: 180 + i * 140, top: '50%', left: '50%', x: '-50%', y: '-50%' }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }} transition={{ duration: 25 + i * 5, repeat: Infinity, ease: 'linear' }} />
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="relative z-10 text-center px-12">
          <motion.div whileHover={{ scale: 1.05 }} className="w-20 h-20 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="text-primary-foreground" size={36} />
          </motion.div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Join Smart VMS</h1>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Create your account with role-based access. Your data is protected with JWT authentication.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {roles.map(r => (
              <motion.div key={r.value} whileHover={{ scale: 1.03 }}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-3 text-left">
                <p className="text-sm font-semibold text-primary-foreground">{r.label}</p>
                <p className="text-xs text-primary-foreground/70">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-1">Create your account</h2>
          <p className="text-muted-foreground mb-5">Fill in your details to get started</p>

          {/* OAuth */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon: () => <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>, label: 'Google', provider: 'Google' },
              { icon: () => <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>, label: 'GitHub', provider: 'GitHub' },
              { icon: Apple, label: 'Apple', provider: 'Apple' },
            ].map(({ icon: Icon, label, provider }) => (
              <motion.button key={provider} whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleOAuth(provider)} type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border bg-secondary/50 text-foreground hover:bg-secondary transition-all text-sm font-medium">
                {typeof Icon === 'function' && Icon.length === 0 ? <Icon /> : <Icon size={18} />}
                <span className="hidden sm:inline">{label}</span>
              </motion.button>
            ))}
          </div>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-3 text-muted-foreground uppercase tracking-wider">or register with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type="text" value={form.name} onChange={e => updateField('name', e.target.value)}
                  onBlur={() => handleBlur('name')} className={inputClass('name')} placeholder="John Doe" />
              </div>
              <AnimatePresence>
                {touched.name && fieldErrors.name && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={12} /> {fieldErrors.name}</motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)}
                  onBlur={() => handleBlur('email')} className={inputClass('email')} placeholder="you@company.com" />
              </div>
              <AnimatePresence>
                {touched.email && fieldErrors.email && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={12} /> {fieldErrors.email}</motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Role</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(r => (
                  <motion.button key={r.value} type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { updateField('role', r.value); setTouched(prev => ({ ...prev, role: true })); }}
                    className={`text-left px-3 py-2 rounded-lg border text-xs transition-all ${
                      form.role === r.value
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30'
                        : 'border-border bg-secondary/30 text-foreground hover:bg-secondary/60'
                    }`}>
                    <span className="font-semibold">{r.label}</span>
                    <br /><span className="text-muted-foreground">{r.desc}</span>
                  </motion.button>
                ))}
              </div>
              <AnimatePresence>
                {touched.role && fieldErrors.role && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={12} /> {fieldErrors.role}</motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={e => updateField('password', e.target.value)} onBlur={() => handleBlur('password')}
                  className={`${inputClass('password')} pr-10`} placeholder="Create a strong password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Strength meter */}
              {form.password && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                  <div className="flex gap-1 mb-1.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength ? strengthColor : 'bg-border'}`} />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                    {passwordChecks.map(c => (
                      <div key={c.label} className="flex items-center gap-1 text-[11px]">
                        <CheckCircle2 size={11} className={c.test(form.password) ? 'text-success' : 'text-muted-foreground/40'} />
                        <span className={c.test(form.password) ? 'text-success' : 'text-muted-foreground'}>{c.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                  onChange={e => updateField('confirmPassword', e.target.value)} onBlur={() => handleBlur('confirmPassword')}
                  className={`${inputClass('confirmPassword')} pr-10`} placeholder="Re-enter password" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <AnimatePresence>
                {touched.confirmPassword && fieldErrors.confirmPassword && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={12} /> {fieldErrors.confirmPassword}</motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-border text-primary focus:ring-ring" />
              <span className="text-xs text-muted-foreground">
                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </span>
            </label>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit"
              disabled={loading || !agreed}
              className="w-full py-2.5 rounded-lg font-semibold text-primary-foreground transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'var(--gradient-primary)' }}>
              {loading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
