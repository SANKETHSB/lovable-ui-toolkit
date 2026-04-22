import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, X, Plus, Trash2 } from 'lucide-react';
import type { Role } from '@/types';
import { toast } from '@/hooks/use-toast';
import { mockVmsBackend } from '@/services/mockVmsBackend';

const MODULES = ['Vendors', 'RFQs', 'Quotations', 'POs', 'Audit', 'Users', 'Roles', 'Reports'];
const ROLES = [
  { name: 'Admin', perms: { Vendors: 'CRUD', RFQs: 'CRUD', Quotations: 'CR', POs: 'CR', Audit: 'R', Users: 'CRUD', Roles: 'CRUD', Reports: 'R' } },
  { name: 'Procurement Manager', perms: { Vendors: 'R', RFQs: 'CRUD', Quotations: 'CRUD', POs: 'CRU', Audit: '', Users: '', Roles: '', Reports: 'CR' } },
  { name: 'Vendor', perms: { Vendors: 'RU', RFQs: 'R', Quotations: 'CRU', POs: 'R', Audit: '', Users: '', Roles: '', Reports: '' } },
  { name: 'Compliance Officer', perms: { Vendors: 'R', RFQs: 'R', Quotations: 'R', POs: 'R', Audit: 'R', Users: '', Roles: '', Reports: 'CR' } },
];
const INITIAL_ROLES: Role[] = ROLES.map((role, index) => ({ id: index + 1, roleName: role.name, description: `${role.name} permissions`, permissions: JSON.stringify(role.perms), createdAt: '2026-01-01' }));

const PermCell = ({ perm }: { perm: string }) => {
  if (!perm) return <span className="text-muted-foreground"><X size={14} /></span>;
  return (
    <div className="flex gap-0.5">
      {['C', 'R', 'U', 'D'].map(p => (
        <span key={p} className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center
          ${perm.includes(p) ? 'bg-success/15 text-success' : 'bg-secondary text-muted-foreground/30'}`}>
          {p}
        </span>
      ))}
    </div>
  );
};

const RoleManagementPage = () => {
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ roleName: '', description: '', permissions: 'R' });
  const createRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const role = await mockVmsBackend.createRole(form, roles);
      setRoles(prev => [...prev, role]);
      setShowForm(false);
      toast({ title: 'Role created', description: 'Permission matrix and audit history updated immediately.' });
    } catch (error) {
      toast({ title: 'Role validation failed', description: error instanceof Error ? error.message : 'Unable to create role', variant: 'destructive' });
    }
  };
  const removeRole = (role: Role) => {
    if (['Admin', 'Procurement Manager', 'Vendor', 'Compliance Officer'].includes(role.roleName)) {
      toast({ title: 'Default role protected', description: 'Default roles cannot be deleted.', variant: 'destructive' });
      return;
    }
    if (window.confirm(`Delete role ${role.roleName}?`)) setRoles(prev => prev.filter(r => r.id !== role.id));
  };
  return (
  <div className="space-y-6">
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="text-primary" size={24} /> Role Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">RBAC permission matrix</p>
      </div>
      <button onClick={() => setShowForm(prev => !prev)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"><Plus size={16} /> Create Role</button>
    </div>

    {showForm && (
      <motion.form initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} onSubmit={createRole} className="glass-card p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input value={form.roleName} onChange={e => setForm(prev => ({ ...prev, roleName: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground" placeholder="Role name" />
        <input value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground" placeholder="Description" />
        <input value={form.permissions} onChange={e => setForm(prev => ({ ...prev, permissions: e.target.value.toUpperCase() }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground" placeholder="CRUD" />
        <button className="rounded-lg bg-primary text-primary-foreground text-sm font-semibold px-4 py-2">Save</button>
      </motion.form>
    )}

    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 sticky left-0 bg-secondary/50">Role</th>
              {MODULES.map(m => (
                <th key={m} className="text-center text-xs font-semibold text-muted-foreground px-3 py-3">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role, i) => {
              const perms = role.permissions.startsWith('{') ? JSON.parse(role.permissions) as Record<string, string> : Object.fromEntries(MODULES.map(m => [m, role.permissions]));
              return <motion.tr key={role.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 sticky left-0 bg-card">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-primary" />
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">{role.roleName}</span>
                    <button onClick={() => removeRole(role)} className="ml-auto text-muted-foreground hover:text-destructive"><Trash2 size={13} /></button>
                  </div>
                </td>
                {MODULES.map(m => (
                  <td key={m} className="px-3 py-3 text-center">
                    <div className="flex justify-center">
                      <PermCell perm={perms[m] || ''} />
                    </div>
                  </td>
                ))}
              </motion.tr>;
            })}
          </tbody>
        </table>
      </div>
    </motion.div>

    <div className="glass-card p-4">
      <p className="text-xs text-muted-foreground flex items-center gap-2">
        <span className="flex gap-0.5">
          {['C', 'R', 'U', 'D'].map(p => (
            <span key={p} className="w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center bg-success/15 text-success">{p}</span>
          ))}
        </span>
        = Create, Read, Update, Delete
      </p>
    </div>
  </div>
  );
};

export default RoleManagementPage;
