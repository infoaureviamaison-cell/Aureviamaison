import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.string().url()]).optional().transform((value) => value || null);
const optionalText = z.string().trim().optional().transform((value) => value || null);

export const certificateInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  shortDescription: optionalText,
  organizationName: z.string().trim().min(1, "Organization name is required").max(160),
  organizationLogo: z.string().url("Organization logo must be a valid URL"),
  certificateImage: z.string().url("Certificate image must be a valid URL"),
  orientation: z.enum(["PORTRAIT", "LANDSCAPE"]),
  issueDate: z.coerce.date(),
  expiryDate: z.union([z.literal(""), z.coerce.date()]).optional().transform((value) => value || null),
  certificateNumber: optionalText,
  verificationUrl: optionalUrl,
  displayOrder: z.coerce.number().int().min(0).default(0),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export const certificateReorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

export type CertificateInput = z.input<typeof certificateInputSchema>;
