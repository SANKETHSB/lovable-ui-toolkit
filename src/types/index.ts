// Auth Types
export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { accessToken: string; refreshToken: string; role: string; userId: number; }

// User
export interface User { id: number; name: string; email: string; role: UserRole; isActive: boolean; isLocked: boolean; lastLogin: string; createdAt: string; }
export type UserRole = 'ADMIN' | 'PROCUREMENT_MANAGER' | 'VENDOR' | 'COMPLIANCE_OFFICER';

// Vendor
export interface Vendor { id: number; companyName: string; gstNumber: string; registrationId: string; email: string; phone?: string; address?: string; status: VendorStatus; complianceStatus: ComplianceStatus; registrationTimestamp: string; approvedAt?: string; }
export type VendorStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT';

// Compliance Document
export interface ComplianceDocument { id: number; vendorId: number; documentName: string; documentType: string; fileType: string; issueDate: string; expiryDate: string; isExpired: boolean; version: number; uploadedAt: string; }

// RFQ
export interface RFQ { id: number; rfqNumber: string; title: string; description?: string; deadline: string; status: RFQStatus; revisionNumber: number; createdBy: number; createdAt: string; items: RFQItem[]; }
export type RFQStatus = 'OPEN' | 'CLOSED' | 'AWARDED' | 'ARCHIVED';
export interface RFQItem { id: number; rfqId: number; itemName: string; quantity: number; unit: string; specifications?: string; }

// Quotation
export interface Quotation { id: number; rfqId: number; vendorId: number; totalPrice: number; taxAmount: number; currency: string; status: QuotationStatus; submittedAt: string; weightedScore?: number; evaluationComments?: string; items: QuotationItem[]; }
export type QuotationStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'AWARDED' | 'REJECTED';
export interface QuotationItem { id: number; rfqItemId: number; unitPrice: number; quantity: number; lineTotal: number; }

// Purchase Order
export interface PurchaseOrder { id: number; poNumber: string; rfqId: number; vendorId: number; quotationId: number; totalCost: number; status: POStatus; deliveryDate: string; generatedAt: string; pdfPath?: string; }
export type POStatus = 'GENERATED' | 'SENT' | 'RECEIVED' | 'CLOSED';

// Audit Log & Notification
export interface AuditLog { id: number; userId: number; action: string; entityType: string; entityId: number; oldValue?: string; newValue?: string; timestamp: string; ipAddress: string; }
export interface Notification { id: number; type: 'EMAIL' | 'IN_APP'; subject: string; message: string; isRead: boolean; sentAt: string; relatedEntityType?: string; relatedEntityId?: number; }

// Shared
export interface PagedResponse<T> { content: T[]; totalElements: number; totalPages: number; currentPage: number; pageSize: number; }
export interface ApiError { status: number; message: string; errors?: string[]; }
export interface VendorAnalytics { totalRFQs: number; wonRFQs: number; winRatio: number; avgBidAmount: number; onTimeDeliveryRate: number; performanceRating: number; }

// Role & Permission
export interface Role { id: number; roleName: string; description: string; permissions: string; createdAt: string; }
