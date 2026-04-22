import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Download, User, Clock } from 'lucide-react';
import type { AuditLog } from '@/types';
import { backend } from '@/services/backend';

const MOCK_LOGS: AuditLog[] = [
  { id: 1, userId: 1, action: 'VENDOR_APPROVED', entityType: 'Vendor', entityId: 2, timestamp: '2026-04-16T10:30:00', ipAddress: '192.168.1.100' },
  { id: 2, userId: 2, action: 'RFQ_CREATED', entityType: 'RFQ', entityId: 5, timestamp: '2026-04-16T09:15:00', ipAddress: '192.168.1.101' },
  { id: 3, userId: 3, action: 'QUOTATION_SUBMITTED', entityType: 'Quotation', entityId: 8, timestamp: '2026-04-15T16:45:00', ipAddress: '10.0.0.55' },
  { id: 4, userId: 2, action: 'RFQ_AWARDED', entityType: 'RFQ', entityId: 4, timestamp: '2026-04-15T14:20:00', ipAddress: '192.168.1.101' },
  { id: 5, userId: 1, action: 'USER_LOCKED', entityType: 'User', entityId: 5, timestamp: '2026-04-15T11:00:00', ipAddress: '192.168.1.100' },
  { id: 6, userId: 2, action: 'PO_GENERATED', entityType: 'PurchaseOrder', entityId: 3, timestamp: '2026-04-14T17:30:00', ipAddress: '192.168.1.101' },
  { id: 7, userId: 4, action: 'COMPLIANCE_CHECK', entityType: 'ComplianceDocument', entityId: 12, timestamp: '2026-04-14T09:00:00', ipAddress: '192.168.1.102' },
];

const ACTION_COLORS: Record<string, string> = {
  VENDOR_APPROVED: 'bg-success/10 text-success',
  RFQ_CREATED: 'bg-primary/10 text-primary',
  QUOTATION_SUBMITTED: 'bg-accent/10 text-accent',
  RFQ_AWARDED: 'bg-accent/10 text-accent',
  USER_LOCKED: 'bg-destructive/10 text-destructive',
  PO_GENERATED: 'bg-success/10 text-success',
  COMPLIANCE_CHECK: 'bg-warning/10 text-warning',
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const AuditLogPage = () => {
  const [search, setSearch] = useState('');
  const filtered = MOCK_LOGS.filter(l => l.action.toLowerCase().includes(search.toLowerCase()) || l.entityType.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-sm text-muted-foreground">Immutable activity trail</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => backend.exportAuditLogs(filtered)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm border border-border bg-card text-foreground hover:bg-secondary transition-colors">
          <Download size={16} /> Export
        </motion.button>
      </div>

      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            placeholder="Search actions or entities..." />
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
        {filtered.map(log => (
          <motion.div key={log.id} variants={item}
            className="glass-card-hover p-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
              <Shield size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ACTION_COLORS[log.action] || 'bg-secondary text-foreground'}`}>
                  {log.action.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-muted-foreground">{log.entityType} #{log.entityId}</span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User size={10} /> User #{log.userId}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {new Date(log.timestamp).toLocaleString()}</span>
                <span className="font-mono">{log.ipAddress}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AuditLogPage;
