export type CertificateOrientation = "PORTRAIT" | "LANDSCAPE";

export type Certificate = {
  id: string;
  title: string;
  shortDescription: string | null;
  organizationName: string;
  organizationLogo: string;
  certificateImage: string;
  orientation: CertificateOrientation;
  issueDate: string;
  expiryDate: string | null;
  certificateNumber: string | null;
  verificationUrl: string | null;
  displayOrder: number;
  active: boolean;
  featured: boolean;
};

export type CertificateFormData = {
  title: string;
  shortDescription: string;
  organizationName: string;
  organizationLogo: string;
  certificateImage: string;
  orientation: CertificateOrientation;
  issueDate: string;
  expiryDate: string;
  certificateNumber: string;
  verificationUrl: string;
  displayOrder: number;
  active: boolean;
  featured: boolean;
};
