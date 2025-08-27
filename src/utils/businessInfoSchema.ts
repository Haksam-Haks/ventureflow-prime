import { z } from 'zod';

// These can be dynamically loaded from API, but here are example values:
export const allowedBusinessTypes = [
  'Sole Proprietorship', 'Partnership', 'Limited Liability Company', 'Corporation', 'Cooperative'
];
export const allowedOwnershipTypes = [
  'Private', 'Public', 'Government', 'Non-Profit'
];

// Strong email regex (RFC 5322 Official Standard)
const strongEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const commonDisposableDomains = [
  'mailinator.com', '10minutemail.com', 'guerrillamail.com', 'tempmail.com', 'yopmail.com', 'trashmail.com', 'fakeinbox.com', 'getnada.com', 'dispostable.com', 'maildrop.cc'
];

function isStrongEmail(email: string) {
  if (!strongEmailRegex.test(email)) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  if (commonDisposableDomains.some(d => domain.endsWith(d))) return false;
  return true;
}

export const businessInfoSchema = z.object({
  businessType: z.string()
    .min(2, { message: 'Business type is required' })
    .refine(val => allowedBusinessTypes.includes(val), { message: 'Invalid business type' }),
  legalName: z.string()
    .min(2, { message: 'Legal business name is required' })
    .max(100, { message: 'Legal name must be at most 100 characters' }),
  tradingName: z.string()
    .min(2, { message: 'Trading name is required' })
    .max(100, { message: 'Trading name must be at most 100 characters' }),
  branchType: z.string()
    .min(2, { message: 'Ownership type is required' })
    .refine(val => allowedOwnershipTypes.includes(val), { message: 'Invalid ownership type' }),
  businessName: z.string()
    .min(2, { message: 'Displayed business name is required' })
    .max(100, { message: 'Displayed name must be at most 100 characters' }),
  websiteUrl: z.string()
    .url({ message: 'Website must be a valid URL' })
    .max(200, { message: 'Website URL must be at most 200 characters' })
    .optional()
    .or(z.literal('').transform(() => undefined)), // allow empty string as undefined
  contactPhone: z.string()
    .min(8, { message: 'Business contact phone is required' })
    .max(20, { message: 'Phone number must be at most 20 characters' })
    .regex(/^\+?\d{8,20}$/, { message: 'Phone number must be valid and include country code' }),
  emailAddress: z.string()
    .min(5, { message: 'Business email address is required' })
    .max(100, { message: 'Email must be at most 100 characters' })
    .refine(isStrongEmail, { message: 'Please enter a valid, non-disposable business email address.' }),
  registrationDate: z.string()
    .refine(val => /^\d{4}-\d{2}-\d{2}$/.test(val), { message: 'Date must be in YYYY-MM-DD format' })
    .refine(val => !isNaN(Date.parse(val)), { message: 'Date of establishment is required' }),
  registrationAuthority: z.string()
    .min(2, { message: 'Registration authority is required' })
    .max(100, { message: 'Registration authority must be at most 100 characters' }),
});
