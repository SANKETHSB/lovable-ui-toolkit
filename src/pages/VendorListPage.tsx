import { useState } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from '@/components/StatusBadge';
import { Building2, Search, Filter, ChevronRight, Plus, Check, X } from 'lucide-react';
import type { Vendor } from '@/types';
import { toast } from '@/hooks/use-toast';
import { mockVmsBackend } from '@/services/mockVmsBackend';

const MOCK_VENDORS: Vendor[] = [
  { id: 1, companyName: 'TechCorp Solutions', gstNumber: 'GST29AABCT1234A1ZN', registrationId: 'VR-2026-001', email: 'contact@techcorp.com', phone: '+91 98765 43210', address: 'Bangalore, India', status: 'APPROVED', complianceStatus: 'COMPLIANT', registrationTimestamp: '2025-08-15', approvedAt: '2025-08-20' },
  { id: 2, companyName: 'Global Supplies Ltd', gstNumber: 'GST27AABCG5678B2ZM', registrationId: 'VR-2026-002', email: 'info@globalsupplies.com', phone: '+91 87654 32109', address: 'Mumbai, India', status: 'PENDING_APPROVAL', complianceStatus: 'COMPLIANT', registrationTimestamp: '2026-03-10' },
  { id: 3, companyName: 'InnovateTech Pvt Ltd', gstNumber: 'GST07AABCI9012C3ZL', registrationId: 'VR-2026-003', email: 'hello@innovatetech.in', status: 'APPROVED', complianceStatus: 'NON_COMPLIANT', registrationTimestamp: '2025-11-01', approvedAt: '2025-11-05' },
  { id: 4, companyName: 'Prime Procurement Inc', gstNumber: 'GST33AABCP3456D4ZK', registrationId: 'VR-2026-004', email: 'sales@primeprocure.com', address: 'Chennai, India', status: 'REJECTED', complianceStatus: 'NON_COMPLIANT', registrationTimestamp: '2026-01-20' },
  { id: 5, companyName: 'StellarWorks Industries', gstNumber: 'GST06AABCS7890E5ZJ', registrationId: 'VR-2026-005', email: 'admin@stellarworks.com', phone: '+91 76543 21098', status: 'SUSPENDED', complianceStatus: 'NON_COMPLIANT', registrationTimestamp: '2025-06-10' },
  { id: 6, companyName: 'NextGen Materials Co', gstNumber: 'GST09AABCN2345F6ZI', registrationId: 'VR-2026-006', email: 'support@nextgenmat.com', status: 'APPROVED', complianceStatus: 'COMPLIANT', registrationTimestamp: '2025-09-25', approvedAt: '2025-10-01' },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const VendorListPage = () => {
  const [vendors, setVendors] = useState(MOCK_VENDORS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ companyName: '', gstNumber: '', registrationId: '', email: '' });

  const filtered = vendors.filter(v => {
    const matchSearch = v.companyName.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase()) || v.gstNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const submitVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const vendor = await mockVmsBackend.registerVendor(form, vendors);
      setVendors(prev => [vendor, ...prev]);
      setForm({ companyName: '', gstNumber: '', registrationId: '', email: '' });
      setShowForm(false);
      toast({ title: 'Vendor submitted', description: 'Pending approval, email verification, and audit logging queued.' });
    } catch (error) {
      toast({ title: 'Validation failed', description: error instanceof Error ? error.message : 'Unable to register vendor', variant: 'destructive' });
    }
  };

  const updateVendor = async (vendor: Vendor, action: 'approve' | 'reject') => {
    try {
      const updated = action === 'approve' ? await mockVmsBackend.approveVendor(vendor) : await mockVmsBackend.rejectVendor(vendor, window.prompt('Rejection reason') || '');
      setVendors(prev => prev.map(v => v.id === vendor.id ? updated : v));
      toast({ title: action === 'approve' ? 'Vendor approved' : 'Vendor rejected', description: 'Status notification and immutable audit log recorded.' });
    } catch (error) {
      toast({ title: 'Action blocked', description: error instanceof Error ? error.message : 'Unable to update vendor', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vendors</h1>
          <p className="text-sm text-muted-foreground">Manage vendor registrations and approvals</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowForm(prev => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm text-primary-foreground"
          style={{ background: 'var(--gradient-primary)' }}>
          <Plus size={16} /> Register Vendor
        </motion.button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} onSubmit={submitVendor} className="glass-card p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
          {(['companyName', 'gstNumber', 'registrationId', 'email'] as const).map(field => (
            <input key={field} value={form[field]} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={field === 'companyName' ? 'Company Name' : field === 'gstNumber' ? 'GST Number' : field === 'registrationId' ? 'Registration ID' : 'Email'} />
          ))}
          <button className="rounded-lg bg-primary text-primary-foreground text-sm font-semibold px-4 py-2">Submit</button>
        </motion.form>
      )}

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            placeholder="Search vendors..." />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none">
            <option value="ALL">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING_APPROVAL">Pending</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <motion.div variants={container} initial="hidden" animate="show" className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Company</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">GST Number</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Compliance</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Registered</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(vendor => (
                <motion.tr key={vendor.id} variants={item}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{vendor.companyName}</p>
                        <p className="text-xs text-muted-foreground">{vendor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs font-mono text-muted-foreground">{vendor.gstNumber}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={vendor.status} /></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><StatusBadge status={vendor.complianceStatus} /></td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">{new Date(vendor.registrationTimestamp).toLocaleDateString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {vendor.status === 'PENDING_APPROVAL' && <>
                        <button onClick={() => updateVendor(vendor, 'approve')} className="p-1.5 rounded-lg hover:bg-success/10 text-success"><Check size={14} /></button>
                        <button onClick={() => updateVendor(vendor, 'reject')} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><X size={14} /></button>
                      </>}
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

export default VendorListPage;
