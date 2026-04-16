import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().trim().min(1, 'Email is required').email('Enter a valid email');

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = emailSchema.safeParse(email);
    if (!result.success) { setError(result.error.issues[0].message); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to login
        </Link>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6"
                style={{ background: 'var(--gradient-primary)' }}>
                <Mail className="text-primary-foreground" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-foreground text-center mb-2">Forgot your password?</h2>
              <p className="text-muted-foreground text-center mb-8">Enter your email and we'll send you a reset link.</p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${error ? 'border-destructive focus:ring-destructive/40' : 'border-input focus:ring-ring'}`}
                      placeholder="you@company.com" />
                  </div>
                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={12} /> {error}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-lg font-semibold text-primary-foreground disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: 'var(--gradient-primary)' }}>
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : 'Send Reset Link'}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-success" size={32} />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Check your email</h2>
              <p className="text-muted-foreground mb-6">We sent a password reset link to <strong className="text-foreground">{email}</strong></p>
              <Link to="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-primary-foreground"
                style={{ background: 'var(--gradient-primary)' }}>
                Back to Sign In
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
