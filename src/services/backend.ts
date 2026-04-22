import type { AuditLog, PurchaseOrder, Quotation, RFQ, Role, User, Vendor } from '@/types';

const wait = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

const sanitize = (value: string) => value.trim().replace(/[<>]/g, '');

const downloadBlob = (filename: string, mimeType: string, content: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const exportCsv = <T extends Record<string, unknown>>(filename: string, rows: T[]) => {
  const headers = Object.keys(rows[0] ?? {});
  const csv = [
    headers.join(','),
    ...rows.map(row => headers.map(header => JSON.stringify(row[header] ?? '')).join(',')),
  ].join('\n');
  downloadBlob(filename, 'text/csv;charset=utf-8', csv);
};

export const exportTextReport = (filename: string, title: string, lines: string[]) => {
  downloadBlob(filename, 'text/plain;charset=utf-8', [title, `Generated: ${new Date().toISOString()}`, '', ...lines].join('\n'));
};

export const mockVmsBackend = {
  async registerVendor(data: Pick<Vendor, 'companyName' | 'gstNumber' | 'registrationId' | 'email'>, existing: Vendor[]) {
    await wait();
    const companyName = sanitize(data.companyName);
    const gstNumber = sanitize(data.gstNumber).toUpperCase();
    const registrationId = sanitize(data.registrationId).toUpperCase();
    const email = sanitize(data.email).toLowerCase();

    if (!companyName || !gstNumber || !registrationId || !email) throw new Error('All mandatory fields are required.');
    if (!/^[A-Z0-9-]{8,24}$/.test(gstNumber)) throw new Error('GST number format is invalid.');
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Valid email is required.');
    if (existing.some(v => v.gstNumber === gstNumber || v.registrationId === registrationId || v.email.toLowerCase() === email)) {
      throw new Error('Duplicate vendor detected by GST, registration ID, or email.');
    }

    return {
      id: Math.max(...existing.map(v => v.id), 0) + 1,
      companyName,
      gstNumber,
      registrationId,
      email,
      status: 'PENDING_APPROVAL',
      complianceStatus: 'COMPLIANT',
      registrationTimestamp: new Date().toISOString(),
    } satisfies Vendor;
  },

  async createRFQ(data: { title: string; itemName: string; quantity: number; deadline: string }, existing: RFQ[]) {
    await wait();
    const title = sanitize(data.title);
    const itemName = sanitize(data.itemName);
    if (!title || !itemName) throw new Error('RFQ title and item are mandatory.');
    if (data.quantity <= 0) throw new Error('Quantity must be greater than zero.');
    if (new Date(data.deadline).getTime() <= Date.now()) throw new Error('Deadline must be in the future.');
    if (existing.some(r => r.title.toLowerCase() === title.toLowerCase())) throw new Error('Duplicate RFQ title warning.');
    const id = Math.max(...existing.map(r => r.id), 0) + 1;
    return {
      id,
      rfqNumber: `RFQ-2026-${String(id).padStart(3, '0')}`,
      title,
      deadline: data.deadline,
      status: 'OPEN',
      revisionNumber: 1,
      createdBy: 2,
      createdAt: new Date().toISOString(),
      items: [{ id: Date.now(), rfqId: id, itemName, quantity: data.quantity, unit: 'Units' }],
    } satisfies RFQ;
  },

  async createUser(data: Pick<User, 'name' | 'email' | 'role'>, existing: User[]) {
    await wait();
    const name = sanitize(data.name);
    const email = sanitize(data.email).toLowerCase();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) throw new Error('Valid name and email are required.');
    if (existing.some(u => u.email.toLowerCase() === email)) throw new Error('User email already exists.');
    return {
      id: Math.max(...existing.map(u => u.id), 0) + 1,
      name,
      email,
      role: data.role,
      isActive: true,
      isLocked: false,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    } satisfies User;
  },

  async createRole(data: Pick<Role, 'roleName' | 'description' | 'permissions'>, existing: Role[]) {
    await wait();
    const roleName = sanitize(data.roleName);
    if (!roleName || !data.permissions) throw new Error('Role name and permissions are required.');
    if (existing.some(r => r.roleName.toLowerCase() === roleName.toLowerCase())) throw new Error('Role already exists.');
    return { id: Math.max(...existing.map(r => r.id), 0) + 1, roleName, description: sanitize(data.description), permissions: data.permissions, createdAt: new Date().toISOString() } satisfies Role;
  },

  approveVendor: async (vendor: Vendor) => (await wait(), { ...vendor, status: 'APPROVED' as const, approvedAt: new Date().toISOString() }),
  rejectVendor: async (vendor: Vendor, reason: string) => {
    await wait();
    if (!sanitize(reason)) throw new Error('Rejection reason is mandatory.');
    return { ...vendor, status: 'REJECTED' as const };
  },
  closeRFQ: async (rfq: RFQ) => (await wait(), { ...rfq, status: 'CLOSED' as const }),
  reviseRFQ: async (rfq: RFQ) => (await wait(), { ...rfq, revisionNumber: rfq.revisionNumber + 1 }),
  awardQuotation: async (quotation: Quotation, reason: string) => {
    await wait();
    if (!sanitize(reason)) throw new Error('Award reason is mandatory.');
    return { ...quotation, status: 'AWARDED' as const, evaluationComments: sanitize(reason), weightedScore: quotation.weightedScore ?? 90 };
  },
  updatePoStatus: async (po: PurchaseOrder) => (await wait(), { ...po, status: po.status === 'GENERATED' ? 'SENT' as const : po.status === 'SENT' ? 'RECEIVED' as const : 'CLOSED' as const }),
  exportAuditLogs: (logs: AuditLog[]) => exportCsv('audit-logs.csv', logs as unknown as Record<string, unknown>[]),
};
