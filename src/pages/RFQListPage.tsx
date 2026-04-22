import { useState } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from '@/components/StatusBadge';
import { FileText, Search, Plus, Clock, ChevronRight, RotateCcw, Lock } from 'lucide-react';
import type { RFQ } from '@/types';
import { toast } from '@/hooks/use-toast';
import { mockVmsBackend } from '@/services/mockVmsBackend';

const MOCK_RFQS: RFQ[] = [
  { id: 1, rfqNumber: 'RFQ-2026-001', title: 'IT Hardware Procurement - Q2', description: 'Laptops, monitors, peripherals for new office', deadline: '2026-04-30T18:00:00', status: 'OPEN', revisionNumber: 1, createdBy: 2, createdAt: '2026-04-01', items: [{ id: 1, rfqId: 1, itemName: 'Dell Latitude 5540', quantity: 50, unit: 'Units' }, { id: 2, rfqId: 1, itemName: '27" Monitor', quantity: 50, unit: 'Units' }] },
  { id: 2, rfqNumber: 'RFQ-2026-002', title: 'Office Furniture Supply', deadline: '2026-04-20T18:00:00', status: 'CLOSED', revisionNumber: 2, createdBy: 2, createdAt: '2026-03-15', items: [{ id: 3, rfqId: 2, itemName: 'Ergonomic Chair', quantity: 100, unit: 'Units' }] },
  { id: 3, rfqNumber: 'RFQ-2026-003', title: 'Cloud Infrastructure Services', deadline: '2026-05-15T18:00:00', status: 'OPEN', revisionNumber: 1, createdBy: 2, createdAt: '2026-04-10', items: [{ id: 4, rfqId: 3, itemName: 'AWS EC2 Instances', quantity: 20, unit: 'Instances' }] },
  { id: 4, rfqNumber: 'RFQ-2026-004', title: 'Annual Stationery Supply', deadline: '2026-03-01T18:00:00', status: 'AWARDED', revisionNumber: 1, createdBy: 2, createdAt: '2026-02-01', items: [] },
  { id: 5, rfqNumber: 'RFQ-2026-005', title: 'Security Surveillance System', deadline: '2026-06-01T18:00:00', status: 'OPEN', revisionNumber: 1, createdBy: 2, createdAt: '2026-04-12', items: [] },
];

const getDeadlineInfo = (deadline: string) => {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff < 0) return { text: 'Expired', urgent: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 7) return { text: `${days}d left`, urgent: false };
  if (days > 0) return { text: `${days}d ${hours}h left`, urgent: days < 3 };
  return { text: `${hours}h left`, urgent: true };
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const RFQListPage = () => {
  const [rfqs, setRfqs] = useState(MOCK_RFQS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', itemName: '', quantity: '1', deadline: '' });

  const filtered = rfqs.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.rfqNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const submitRFQ = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rfq = await mockVmsBackend.createRFQ({ ...form, quantity: Number(form.quantity) }, rfqs);
      setRfqs(prev => [rfq, ...prev]);
      setForm({ title: '', itemName: '', quantity: '1', deadline: '' });
      setShowForm(false);
      toast({ title: 'RFQ created', description: 'RFQ ID generated, vendors invited, and audit log recorded.' });
    } catch (error) {
      toast({ title: 'RFQ validation failed', description: error instanceof Error ? error.message : 'Unable to create RFQ', variant: 'destructive' });
    }
  };

  const updateRFQ = async (rfq: RFQ, action: 'close' | 'revise') => {
    const updated = action === 'close' ? await mockVmsBackend.closeRFQ(rfq) : await mockVmsBackend.reviseRFQ(rfq);
    setRfqs(prev => prev.map(r => r.id === rfq.id ? updated : r));
    toast({ title: action === 'close' ? 'RFQ closed' : 'Revision created', description: 'Deadline rules, version history, and notifications applied.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">RFQs</h1>
          <p className="text-sm text-muted-foreground">Manage requests for quotation</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowForm(prev => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm text-primary-foreground"
          style={{ background: 'var(--gradient-primary)' }}>
          <Plus size={16} /> Create RFQ
        </motion.button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} onSubmit={submitRFQ} className="glass-card p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
          <input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground" placeholder="RFQ title" />
          <input value={form.itemName} onChange={e => setForm(prev => ({ ...prev, itemName: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground" placeholder="Item name" />
          <input type="number" min="1" value={form.quantity} onChange={e => setForm(prev => ({ ...prev, quantity: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground" placeholder="Quantity" />
          <input type="datetime-local" value={form.deadline} onChange={e => setForm(prev => ({ ...prev, deadline: e.target.value }))} className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground" />
          <button className="rounded-lg bg-primary text-primary-foreground text-sm font-semibold px-4 py-2">Create</button>
        </motion.form>
      )}

      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            placeholder="Search RFQs..." />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none">
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
          <option value="AWARDED">Awarded</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4">
        {filtered.map(rfq => {
          const dl = getDeadlineInfo(rfq.deadline);
          return (
            <motion.div key={rfq.id} variants={item} className="glass-card-hover p-5 cursor-pointer group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-muted-foreground">{rfq.rfqNumber}</span>
                      <StatusBadge status={rfq.status} />
                      {rfq.revisionNumber > 1 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">Rev {rfq.revisionNumber}</span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">{rfq.title}</h3>
                    {rfq.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{rfq.description}</p>}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={12} className={dl.urgent ? 'text-destructive' : ''} />
                        <span className={dl.urgent ? 'text-destructive font-medium' : ''}>{dl.text}</span>
                      </span>
                      <span>{rfq.items.length} items</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateRFQ(rfq, 'revise')} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary" aria-label="Revise RFQ"><RotateCcw size={14} /></button>
                  {rfq.status === 'OPEN' && <button onClick={() => updateRFQ(rfq, 'close')} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive" aria-label="Close RFQ"><Lock size={14} /></button>}
                  <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-1" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default RFQListPage;
