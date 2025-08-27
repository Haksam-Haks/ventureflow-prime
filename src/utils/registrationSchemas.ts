import { z } from 'zod';

// Business Info Step
export const businessInfoSchema = z.object({
  businessType: z.string().min(2, 'Business type is required'),
  legalName: z.string().min(2, 'Legal business name is required').max(100),
  tradingName: z.string().min(2, 'Trading name is required').max(100),
  branchType: z.string().min(2, 'Ownership type is required'),
  businessName: z.string().min(2, 'Displayed business name is required').max(100),
  websiteUrl: z.string().url('Website must be a valid URL').max(200).optional().or(z.literal('').transform(() => undefined)),
  contactPhone: z.string().min(8, 'Business contact phone is required').max(20).regex(/^\+?\d{8,20}$/, 'Phone number must be valid and include country code'),
  emailAddress: z.string().min(5, 'Business email address is required').max(100).email('Please enter a valid, non-disposable business email address.'),
  registrationDate: z.string().refine(val => /^\d{4}-\d{2}-\d{2}$/.test(val), 'Date must be in YYYY-MM-DD format').refine(val => !isNaN(Date.parse(val)), 'Date of establishment is required'),
  registrationAuthority: z.string().min(2, 'Registration authority is required').max(100),
});

// Address Step
export const addressStepSchema = z.object({
  parishId: z.string().min(1, 'Parish is required'),
  physicalAddress: z.string().min(2, 'Physical address is required').max(200),
  regionId: z.string().min(1, 'Region is required'),
  districtId: z.string().min(1, 'District is required'),
  countyId: z.string().min(1, 'County is required'),
  subCountyId: z.string().min(1, 'Sub-county is required'),
});

// Bank Step
export const bankAccountSchema = z.object({
  bankId: z.string().min(1, 'Bank is required'),
  accountName: z.string().min(2, 'Account name is required').max(100),
  accountNumber: z.string().min(5, 'Account number is required').max(30).regex(/^\d+$/, 'Account number must be numeric'),
  branch: z.string().min(1, 'Bank branch is required'),
  accountType: z.string().min(1, 'Account type is required'),
  isPrimary: z.boolean(),
});
export const bankStepSchema = z.object({
  bankAccounts: z.array(bankAccountSchema).min(1, 'At least one bank account is required').refine(arr => arr.some(a => a.isPrimary), 'At least one primary bank account is required'),
});

// Contact Step
export const contactSchema = z.object({
  name: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Contact email must be valid'),
  phone: z.string().regex(/^\+[1-9]\d{7,14}$/, 'Enter a valid international phone number (e.g. +256764521328)'),
  alternatePhone: z.string().optional(),
  position: z.string().optional(),
  physicalAddress: z.string().optional(),
  isPrimary: z.boolean(),
  parish: z.string().min(1, 'Parish is required'),
  parishId: z.string().min(1, 'Parish is required'),
  subCounty: z.string().min(1, 'Sub-county is required'),
  subCountyId: z.string().min(1, 'Sub-county is required'),
  county: z.string().min(1, 'County is required'),
  countyId: z.string().min(1, 'County is required'),
  district: z.string().min(1, 'District is required'),
  districtId: z.string().min(1, 'District is required'),
  region: z.string().min(1, 'Region is required'),
  regionId: z.string().min(1, 'Region is required'),
});
export const contactStepSchema = z.object({
  contacts: z.array(contactSchema).min(1, 'At least one contact is required').refine(arr => arr.some(a => a.isPrimary), 'At least one primary contact is required'),
});

// Attachments Step
export const attachmentsStepSchema = z.object({
  businessNameCert: z.any().refine(val => val, 'Certified Copy Of Registered Business Name is required'),
  tradeLicense: z.any().refine(val => val, 'Certified Copy Of Trade License is required'),
  taxCert: z.any().refine(val => val, 'Certified Copy Tax Certificate is required'),
  passportPhoto: z.any().refine(val => val, 'Passport Photo is required'),
  ninId: z.string().min(5, 'NIN Number is required'),
});

// Images Step
export const imagesStepSchema = z.object({
  images: z.array(z.any()).min(1, 'At least one image is required').refine(arr => arr.every((img: File) => ['image/jpeg','image/png','image/webp'].includes(img.type)), 'Only JPEG, PNG, or WEBP images allowed').refine(arr => arr.every((img: File) => img.size <= 5 * 1024 * 1024), 'Each image must be 5MB or less'),
  coverImageIndex: z.number().min(0, 'Cover image index required'),
});
