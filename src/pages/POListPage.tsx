import { useState } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from '@/components/StatusBadge';
import { ShoppingCart, Download, ChevronRight } from 'lucide-react';
import type { PurchaseOrder } from '@/types';
import { toast } from '@/hooks/use-toast';
import { exportTextReport, backend } from '@/services/backend';

const MOCK_POS: PurchaseOrder[] = [
  { id: 1, poNumber: 'PO-2026-001', rfqId: 4, vendorId: 1, quotationId: 1, totalCost: 485000, status: 'RECEIVED', deliveryDate: '2026-04-10', generatedAt: '2026-03-15' },
  { id: 2, poNumber: 'PO-2026-002', rfqId: 2, vendorId: 6, quotationId: 3, totalCost: 220000, status: 'SENT', deliveryDate: '2026-05-01', generatedAt: '2026-04-05' },
  { id: 3, poNumber: 'PO-2026-003', rfqId: 1, vendorId: 3, quotationId: 5, totalCost: 1250000, status: 'GENERATED', deliveryDate: '2026-06-15', generatedAt: '2026-04-12' },
  { id: 4, poNumber: 'PO-2026-004', rfqId: 3, vendorId: 1, quotationId: 7, totalCost: 890000, status: 'CLOSED', deliveryDate: '2026-03-20', generatedAt: '2026-02-28' },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const POListPage = () => {
  const [pos, setPos] = useState(MOCK_POS);
  const downloadPo = (po: PurchaseOrder) => exportTextReport(`${po.poNumber}.txt`, po.poNumber, [`RFQ: ${po.rfqId}`, `Vendor: ${po.vendorId}`, `Total: INR ${po.totalCost}`, `Delivery: ${po.deliveryDate}`, `Status: ${po.status}`]);
  const advanceStatus = async (po: PurchaseOrder) => {
    const updated = await backend.updatePoStatus(po);
    setPos(prev => prev.map(item => item.id === po.id ? updated : item));
    toast({ title: 'PO status updated', description: 'Vendor notification, immutable PO record, and audit log completed.' });
  };
  return (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Purchase Orders</h1>
      <p className="text-sm text-muted-foreground">Track and manage purchase orders</p>
    </div>

    <motion.div variants={container} initial="hidden" animate="show" className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">PO Number</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Total Cost</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Delivery</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Generated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {pos.map(po => (
              <motion.tr key={po.id} variants={item} className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center text-success shrink-0">
                      <ShoppingCart size={16} />
                    </div>
                    <span className="text-sm font-medium text-foreground font-mono">{po.poNumber}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-foreground">₹{po.totalCost.toLocaleString()}</td>
                <td className="px-4 py-3"><StatusBadge status={po.status} /></td>
                <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">{new Date(po.deliveryDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">{new Date(po.generatedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => downloadPo(po)} className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" aria-label="Download PO">
                      <Download size={14} />
                    </motion.button>
                    <button onClick={() => advanceStatus(po)} className="p-1 rounded-lg text-muted-foreground hover:text-primary" aria-label="Advance PO status"><ChevronRight size={16} className="group-hover:translate-x-1 transition-all" /></button>
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

export default POListPage;
