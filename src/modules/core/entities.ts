export type UserRole = "admin" | "employee" | "client";

export type ClientStatus = "active" | "inactive" | "archived";

export type ProjectStatus = "active" | "on_hold" | "completed" | "archived";

export type DocumentType = "one_off" | "recurring" | "media_plan";

export type DocumentStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "signed"
  | "rejected"
  | "expired"
  | "archived";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  clientId: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  legalName: string | null;
  taxId: string | null;
  primaryContactName: string | null;
  primaryContactEmail: string | null;
  primaryContactPhone: string | null;
  status: ClientStatus;
  ownerUserId: string | null;
  googleDriveFolderId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string | null;
  department: string | null;
  status: ProjectStatus;
  startsAt: Date | null;
  endsAt: Date | null;
  createdByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  projectId: string;
  clientId: string;
  createdByUserId: string | null;
  type: DocumentType;
  status: DocumentStatus;
  title: string;
  proposalNumber: string;
  currency: string;
  totalAmount: string;
  monthlyAmount: string | null;
  recurringMonths: number | null;
  startsAt: Date | null;
  endsAt: Date | null;
  content: Record<string, unknown>;
  internalMetadata: Record<string, unknown>;
  publicPdfDriveFileId: string | null;
  signedFileDriveFileId: string | null;
  clientPortalToken: string | null;
  sentAt: Date | null;
  viewedAt: Date | null;
  signedAt: Date | null;
  invoiceCheckedAt: Date | null;
  invoiceIssuedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
