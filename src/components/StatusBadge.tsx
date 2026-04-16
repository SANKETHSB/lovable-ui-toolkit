import type { VendorStatus, QuotationStatus, RFQStatus, POStatus, ComplianceStatus } from '@/types';

type StatusType = VendorStatus | QuotationStatus | RFQStatus | POStatus | ComplianceStatus | string;

const STATUS_STYLES: Record<string, string> = {
  APPROVED: 'bg-success/15 text-success border-success/30',
  COMPLIANT: 'bg-success/15 text-success border-success/30',
  OPEN: 'bg-primary/15 text-primary border-primary/30',
  AWARDED: 'bg-accent/15 text-accent border-accent/30',
  SUBMITTED: 'bg-primary/15 text-primary border-primary/30',
  GENERATED: 'bg-primary/15 text-primary border-primary/30',
  SENT: 'bg-warning/15 text-warning border-warning/30',
  RECEIVED: 'bg-success/15 text-success border-success/30',
  CLOSED: 'bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30',
  PENDING_APPROVAL: 'bg-warning/15 text-warning border-warning/30',
  REJECTED: 'bg-destructive/15 text-destructive border-destructive/30',
  SUSPENDED: 'bg-destructive/15 text-destructive border-destructive/30',
  NON_COMPLIANT: 'bg-destructive/15 text-destructive border-destructive/30',
  UNDER_REVIEW: 'bg-warning/15 text-warning border-warning/30',
  ARCHIVED: 'bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30',
};

const StatusBadge = ({ status }: { status: StatusType }) => {
  const style = STATUS_STYLES[status] || 'bg-secondary text-secondary-foreground border-border';
  const label = status.replace(/_/g, ' ');
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:scale-105 ${style}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
