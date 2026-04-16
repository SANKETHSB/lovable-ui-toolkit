import { motion } from 'framer-motion';
import StatusBadge from '@/components/StatusBadge';
import { ClipboardList, ChevronRight } from 'lucide-react';
import type { Quotation } from '@/types';

const MOCK_QUOTATIONS: Quotation[] = [
  { id: 1, rfqId: 1, vendorId: 1, totalPrice: 485000, taxAmount: 87300, currency: 'INR', status: 'SUBMITTED', submittedAt: '2026-04-12T10:00:00', items: [{ id: 1, rfqItemId: 1, unitPrice: 75000, quantity: 50, lineTotal: 375000 }, { id: 2, rfqItemId: 2, unitPrice: 22000, quantity: 50, lineTotal: 110000 }] },
  { id: 2, rfqId: 1, vendorId: 3, totalPrice: 520000, taxAmount: 93600, currency: 'INR', status: 'UNDER_REVIEW', submittedAt: '2026-04-13T14:30:00', weightedScore: 78, items: [] },
  { id: 3, rfqId: 2, vendorId: 6, totalPrice: 220000, taxAmount: 39600, currency: 'INR', status: 'AWARDED', submittedAt: '2026-04-05T09:00:00', weightedScore: 92, evaluationComments: 'Best price-quality ratio', items: [] },
  { id: 4, rfqId: 3, vendorId: 1, totalPrice: 890000, taxAmount: 160200, currency: 'INR', status: 'SUBMITTED', submittedAt: '2026-04-14T16:00:00', items: [] },
  { id: 5, rfqId: 4, vendorId: 3, totalPrice: 35000, taxAmount: 6300, currency: 'INR', status: 'REJECTED', submittedAt: '2026-02-10T11:00:00', evaluationComments: 'Non-compliant specs', items: [] },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const QuotationListPage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Quotations</h1>
      <p className="text-sm text-muted-foreground">View and evaluate vendor quotations</p>
    </div>
    <motion.div variants={container} initial="hidden" animate="show" className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">RFQ / Vendor</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Total</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Score</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Submitted</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {MOCK_QUOTATIONS.map(q => (
              <motion.tr key={q.id} variants={item} className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <ClipboardList size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">RFQ #{q.rfqId}</p>
                      <p className="text-xs text-muted-foreground">Vendor #{q.vendorId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-foreground">₹{q.totalPrice.toLocaleString()}</td>
                <td className="px-4 py-3"><StatusBadge status={q.status} /></td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {q.weightedScore ? (
                    <span className={`text-sm font-semibold ${q.weightedScore >= 80 ? 'text-success' : q.weightedScore >= 60 ? 'text-warning' : 'text-destructive'}`}>
                      {q.weightedScore}/100
                    </span>
                  ) : <span className="text-xs text-muted-foreground">—</span>}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">{new Date(q.submittedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  </div>
);

export default QuotationListPage;
