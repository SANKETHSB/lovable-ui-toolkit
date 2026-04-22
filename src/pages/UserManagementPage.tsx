import { useState } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from '@/components/StatusBadge';
import { UserCog, Search, Plus, Lock, Unlock, ChevronRight } from 'lucide-react';
import type { User, UserRole } from '@/types';
import { toast } from '@/hooks/use-toast';
import { mockVmsBackend } from '@/services/mockVmsBackend';

const MOCK_USERS: User[] = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@infosys.com', role: 'ADMIN', isActive: true, isLocked: false, lastLogin: '2026-04-16T10:30:00', createdAt: '2024-06-01' },
  { id: 2, name: 'Priya Sharma', email: 'priya@infosys.com', role: 'PROCUREMENT_MANAGER', isActive: true, isLocked: false, lastLogin: '2026-04-16T09:00:00', createdAt: '2024-08-15' },
  { id: 3, name: 'Global Supplies', email: 'vendor@globalsupplies.com', role: 'VENDOR', isActive: true, isLocked: false, lastLogin: '2026-04-15T16:00:00', createdAt: '2025-01-10' },
  { id: 4, name: 'Meera Patel', email: 'meera@infosys.com', role: 'COMPLIANCE_OFFICER', isActive: true, isLocked: false, lastLogin: '2026-04-14T14:00:00', createdAt: '2025-03-20' },
  { id: 5, name: 'TechCorp Solutions', email: 'admin@techcorp.com', role: 'VENDOR', isActive: false, isLocked: true, lastLogin: '2026-03-01T10:00:00', createdAt: '2024-12-05' },
];

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin', PROCUREMENT_MANAGER: 'Proc. Manager', VENDOR: 'Vendor', COMPLIANCE_OFFICER: 'Compliance'
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const UserManagementPage = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'VENDOR' as UserRole });
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await mockVmsBackend.createUser(form, users);
      setUsers(prev => [user, ...prev]);
      setShowForm(false);
      toast({ title: 'User created', description: 'Role assignment, access policy, and audit trail updated.' });
    } catch (error) {
      toast({ title: 'User validation failed', description: error instanceof Error ? error.message : 'Unable to create user', variant: 'destructive' });
    }
  };

  const toggleLock = (user: User) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isLocked: !u.isLocked, isActive: u.isLocked } : u));
    toast({ title: user.isLocked ? 'User unlocked' : 'User locked', description: 'Unauthorized access controls and audit logs updated.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground">Manage users, roles, and access</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowForm(prev => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm text-primary-foreground"
          style={{ background: 'var(--gradient-primary)' }}>
          <Plus size={16} /> Create User
        </motion.button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} onSubmit={createUser} className="glass-card p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground" placeholder="Full name" />
          <input value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground" placeholder="Email" />
          <select value={form.role} onChange={e => setForm(prev => ({ ...prev, role: e.target.value as UserRole }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground">
            {Object.keys(ROLE_LABELS).map(role => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}
          </select>
          <button className="rounded-lg bg-primary text-primary-foreground text-sm font-semibold px-4 py-2">Create</button>
        </motion.form>
      )}

      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            placeholder="Search users..." />
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">User</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Role</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Last Login</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <motion.tr key={u.id} variants={item} className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0"
                        style={{ background: 'var(--gradient-primary)' }}>{u.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-md bg-secondary text-foreground">{ROLE_LABELS[u.role]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={u.isLocked ? 'SUSPENDED' : u.isActive ? 'APPROVED' : 'REJECTED'} />
                      {u.isLocked && <Lock size={12} className="text-destructive" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">{new Date(u.lastLogin).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <motion.button whileHover={{ scale: 1.1 }} onClick={() => toggleLock(u)}
                        className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                        {u.isLocked ? <Unlock size={14} /> : <Lock size={14} />}
                      </motion.button>
                      <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default UserManagementPage;
