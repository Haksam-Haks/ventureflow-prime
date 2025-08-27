import React, { useEffect, useState } from 'react';
import countries from '../../data/countries.json';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '../../components/ui/select';
import { z } from 'zod';
import { Input } from '../../components/ui/input';
import { BusinessRegistrationForm } from '../../types/types';


interface BusinessInfoStepProps {
  values: Pick<BusinessRegistrationForm,
    'legalName'|'tradingName'|'registrationDate'|'websiteUrl'|'branchType'|'businessType'|'businessName'|'contactPhone'|'emailAddress'|'registrationAuthority'
  >;
  onChange: (fields: Partial<BusinessRegistrationForm>) => void;
  errors: { [key: string]: string };
  setErrors?: (errors: { [key: string]: string }) => void;
  disabled?: boolean;
}


import apiService from '../../services/apiService';

// Allowed types can be loaded from API, but here are example values for validation fallback:
const allowedBusinessTypes = [
  'Sole Proprietorship', 'Partnership', 'Limited Liability Company', 'Corporation', 'Cooperative'
];
const allowedOwnershipTypes = [
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

const businessInfoSchema = z.object({
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
    .or(z.literal('').transform(() => undefined)),
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




const BusinessInfoStep: React.FC<BusinessInfoStepProps> = ({
  values,
  onChange,
  errors = {},
  setErrors,
  disabled
}) => {
  // Country picker state for phone (must be inside component)
  const [selectedCountry, setSelectedCountry] = useState(() => {
    return countries.find((c: any) => c.code === 'UG') || countries[0];
  });

  const [ownershipTypes, setOwnershipTypes] = useState<string[]>([]);
  const [businessTypeOptions, setBusinessTypeOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchOwnershipTypes = async () => {
      try {
        const api = apiService();
        const res = await api.sendPostToServer('businesses/ownership-types', {});
        let arr: any[] = [];
        if (Array.isArray(res)) {
          arr = res;
        } else if (res && typeof res === 'object' && 'data' in res && Array.isArray((res as any).data)) {
          arr = (res as any).data;
        }
        arr = arr.map((t: any) => t.name || t);
        setOwnershipTypes(arr);
      } catch (e) {
        setOwnershipTypes([]);
      }
    };

    const fetchBusinessTypes = async () => {
      try {
        const api = apiService();
        const res = await api.sendPostToServer('businesses/business-types', {});
        let arr: any[] = [];
        if (Array.isArray(res)) {
          arr = res;
        } else if (res && typeof res === 'object' && 'data' in res && Array.isArray((res as any).data)) {
          arr = (res as any).data;
        }
        arr = arr.map((t: any) => ({ value: t.name || t, label: t.name || t }));
        setBusinessTypeOptions(arr);
      } catch (e) {
        setBusinessTypeOptions([]);
      }
    };

    fetchOwnershipTypes();
    fetchBusinessTypes();
  }, []);


  useEffect(() => {
    let validDate = values.registrationDate;
    if (!validDate || isNaN(Date.parse(validDate))) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      validDate = `${yyyy}-${mm}-${dd}`;
      onChange({ registrationDate: validDate });
    }
  }, [values.registrationDate, onChange]);

  useEffect(() => {
    if (values.legalName && values.businessName !== values.legalName) {
      onChange({ businessName: values.legalName });
    }
  }, [values.legalName, values.businessName, onChange]);


  const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});

  const handleFieldChange = (fields: Partial<typeof values>) => {
    const newValues = { ...values, ...fields };
    let validationErrors: { [key: string]: string } = {};
    try {
      businessInfoSchema.parse(newValues);
    } catch (err: any) {
      if (err.errors) {
        err.errors.forEach((e: any) => {
          if (e.path && e.path[0]) {
            const key = e.path[0] as keyof typeof newValues;
            // Only show error for required or filled optional fields
            if (newValues[key] !== undefined && newValues[key] !== null && newValues[key] !== '') {
              validationErrors[key as string] = e.message;
            } else if (e.message && /required/i.test(e.message)) {
              validationErrors[key as string] = e.message;
            }
          }
        });
      }
    }
    if (setErrors) {
      setErrors(validationErrors);
    } else {
      setLocalErrors(validationErrors);
    }
    onChange(fields);
  };

  // Use errors from props if provided, else use localErrors
  const formErrors = Object.keys(errors).length > 0 ? errors : localErrors;

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Business Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Business Type */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Business Type *</label>
          <select
            value={values.businessType || ''}
            onChange={e => handleFieldChange({ businessType: e.target.value })}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${formErrors.businessType ? 'border-red-500' : 'border-gray-300'}`}
            data-error="businessType"
            disabled={disabled}
          >
            <option value="">Select type</option>
            {businessTypeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {formErrors.businessType && <p className="text-red-500 text-sm mt-1">{formErrors.businessType}</p>}
        </div>
        {/* Legal Name */}
        <div className="mb-4">
          <label htmlFor="legalName" className="block text-gray-700 mb-2">Legal Business Name *</label>
          <Input
            type="text"
            id="legalName"
            name="legalName"
            value={values.legalName || ''}
            onChange={e => {
              const value = e.target.value;
              handleFieldChange({ legalName: value, businessName: value });
            }}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${(formErrors.legalName || (!values.legalName && formErrors && Object.keys(formErrors).length > 0)) ? 'border-red-500' : 'border-gray-300'}`}
            data-error="legalName"
            disabled={disabled}
            placeholder="Registered legal name"
          />
          {(formErrors.legalName || (!values.legalName && formErrors && Object.keys(formErrors).length > 0)) && (
            <p className="text-red-500 text-sm mt-1">{formErrors.legalName || 'Legal business name is required'}</p>
          )}
        </div>
        {/* Trading Name */}
        <div className="mb-4">
          <label htmlFor="tradingName" className="block text-gray-700 mb-2">Trading Name *</label>
          <Input
            type="text"
            id="tradingName"
            name="tradingName"
            value={values.tradingName || ''}
            onChange={e => handleFieldChange({ tradingName: e.target.value })}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${(formErrors.tradingName || (!values.tradingName && formErrors && Object.keys(formErrors).length > 0)) ? 'border-red-500' : 'border-gray-300'}`}
            data-error="tradingName"
            disabled={disabled}
            placeholder="Business trading name"
          />
          {(formErrors.tradingName || (!values.tradingName && formErrors && Object.keys(formErrors).length > 0)) && (
            <p className="text-red-500 text-sm mt-1">{formErrors.tradingName || 'Trading name is required'}</p>
          )}
        </div>
        {/* Ownership Type */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Ownership Type *</label>
          <select
            value={values.branchType || ''}
            onChange={e => handleFieldChange({ branchType: e.target.value })}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${(formErrors.branchType || (!values.branchType && formErrors && Object.keys(formErrors).length > 0)) ? 'border-red-500' : 'border-gray-300'}`}
            data-error="branchType"
            disabled={disabled}
          >
            <option value="">Select ownership type</option>
            {ownershipTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {(formErrors.branchType || (!values.branchType && formErrors && Object.keys(formErrors).length > 0)) && (
            <p className="text-red-500 text-sm mt-1">{formErrors.branchType || 'Ownership type is required'}</p>
          )}
        </div>
        {/* Displayed Business Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Displayed Business Name *</label>
          <Input
            type="text"
            value={values.businessName || values.legalName || values.tradingName || ''}
            onChange={e => handleFieldChange({ businessName: e.target.value })}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${(formErrors.businessName || (!values.businessName && formErrors && Object.keys(formErrors).length > 0)) ? 'border-red-500' : 'border-gray-300'}`}
            data-error="businessName"
            disabled={disabled}
            placeholder="Name shown to customers"
          />
          {(formErrors.businessName || (!values.businessName && formErrors && Object.keys(formErrors).length > 0)) && (
            <p className="text-red-500 text-sm mt-1">{formErrors.businessName || 'Displayed business name is required'}</p>
          )}
        </div>
        {/* Website (optional) */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Website (optional)</label>
          <Input
            type="url"
            value={values.websiteUrl || ''}
            onChange={e => handleFieldChange({ websiteUrl: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={disabled}
            placeholder="https://example.com"
          />
        </div>
        {/* Business Contact Phone with Country Picker */}
        <div className="mb-4">
  <label htmlFor="contactPhone" className="block text-gray-700 mb-2">
    Business Contact Phone *
  </label>

  <div className="flex gap-2">
    {/* Country Selector */}
    <div className="w-1/3">
      <Select
        value={selectedCountry.code}
        onValueChange={(code: any) => {
          const country = countries.find((c: any) => c.code === code);
          if (country) {
            setSelectedCountry(country);
            const oldNumber = values.contactPhone?.replace(/^\+?\d+/, '') || '';
            handleFieldChange({ contactPhone: `${country.dialling_code}${oldNumber}` });
          }
        }}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue asChild>
            <span className="flex items-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
              {selectedCountry.flag ? (
                <img
                  src={selectedCountry.flag}
                  alt={selectedCountry.code + ' flag'}
                  style={{
                    width: '1.2em',
                    height: '1.2em',
                    display: 'inline',
                    verticalAlign: 'middle',
                    marginRight: 4,
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span style={{ marginRight: 4 }}>{selectedCountry.code}</span>
              )}
              <span className="ml-1 font-medium">{selectedCountry.name} ({selectedCountry.dialling_code})</span>
            </span>
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="bg-white shadow-lg">
          {countries.map((c: any) => (
            <SelectItem key={`${c.code}-${c.dialling_code}`} value={c.code}>
              <span className="flex items-center">
                {c.flag ? (
                  <img
                    src={c.flag}
                    alt={`${c.code} flag`}
                    style={{
                      width: '1.2em',
                      height: '1.2em',
                      display: 'inline',
                      verticalAlign: 'middle',
                      marginRight: 4,
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span style={{ marginRight: 4 }}>{c.code}</span>
                )}
                <span className="ml-1">{c.name} ({c.dialling_code})</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Phone Input with fixed country code */}
    <div className="flex-1 flex items-center">
      <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-700 rounded-l-md select-none text-sm font-medium">
        {selectedCountry.dialling_code}
      </span>
      <Input
        id="contactPhone"
        type="tel"
        className={`w-full p-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
          formErrors.contactPhone ? 'border-red-500' : 'border-gray-300'
        }`}
        value={(values.contactPhone || '').replace(selectedCountry.dialling_code, '')}
        onChange={(e) => {
          let raw = e.target.value;
          let cleaned = raw.replace(/[^\d]/g, '');
          let fullNumber = selectedCountry.dialling_code + cleaned;

          // Try to auto-select country if user types a different country code
          const match = /^\+\d{1,4}/.exec(e.target.value.startsWith('+') ? e.target.value : selectedCountry.dialling_code + cleaned);
          if (match) {
            const code = match[0];
            const found = countries.find((c: any) => c.dialling_code === code);
            if (found && found.code !== selectedCountry.code) {
              setSelectedCountry(found);
              fullNumber = code + e.target.value.replace(code, '').replace(/[^\d]/g, '');
            }
          }
          handleFieldChange({ contactPhone: fullNumber });
        }}
  placeholder="e.g., 700000000"
  maxLength={9}
        disabled={disabled}
        style={{ borderLeft: 'none' }}
      />
    </div>
  </div>

  {/* Validation Error */}
  {formErrors.contactPhone && (
    <p className="text-red-500 text-sm mt-1">{formErrors.contactPhone}</p>
  )}
</div>

        {/* Business Email Address */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Business Email Address *</label>
          <Input
            type="email"
            value={values.emailAddress || ''}
            onChange={e => handleFieldChange({ emailAddress: e.target.value })}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${(
              formErrors.emailAddress ||
              (!values.emailAddress && formErrors && Object.keys(formErrors).length > 0) ||
              (values.emailAddress && !isStrongEmail(values.emailAddress))
            ) ? 'border-red-500' : 'border-gray-300'}`}
            data-error="emailAddress"
            disabled={disabled}
            placeholder="your@email.com"
          />
          {(
            formErrors.emailAddress ||
            (!values.emailAddress && formErrors && Object.keys(formErrors).length > 0) ||
            (values.emailAddress && !isStrongEmail(values.emailAddress))
          ) && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.emailAddress
                || (!values.emailAddress && 'Business email address is required')
                || (values.emailAddress && !isStrongEmail(values.emailAddress) && 'Please enter a valid, non-disposable business email address.')}
            </p>
          )}
        </div>
        {/* Registration & Legal Info */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date of Establishment *</label>
          <Input
            type="date"
            value={values.registrationDate || ''}
            onChange={e => handleFieldChange({ registrationDate: e.target.value })}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${(formErrors.registrationDate || (!values.registrationDate && formErrors && Object.keys(formErrors).length > 0)) ? 'border-red-500' : 'border-gray-300'}`}
            data-error="registrationDate"
            disabled={disabled}
            max={(() => {
              const today = new Date();
              const yyyy = today.getFullYear();
              const mm = String(today.getMonth() + 1).padStart(2, '0');
              const dd = String(today.getDate()).padStart(2, '0');
              return `${yyyy}-${mm}-${dd}`;
            })()}
          />
          {(formErrors.registrationDate || (!values.registrationDate && formErrors && Object.keys(formErrors).length > 0)) && (
            <p className="text-red-500 text-sm mt-1">{formErrors.registrationDate || 'Date of establishment is required'}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Registration Authority *</label>
          <Input
            type="text"
            value={values.registrationAuthority || ''}
            onChange={e => handleFieldChange({ registrationAuthority: e.target.value })}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${(formErrors.registrationAuthority || (!values.registrationAuthority && formErrors && Object.keys(formErrors).length > 0)) ? 'border-red-500' : 'border-gray-300'}`}
            data-error="registrationAuthority"
            disabled={disabled}
            placeholder="e.g., URSB, Ministry of Tourism"
          />
          {(formErrors.registrationAuthority || (!values.registrationAuthority && formErrors && Object.keys(formErrors).length > 0)) && (
            <p className="text-red-500 text-sm mt-1">{formErrors.registrationAuthority || 'Registration authority is required'}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BusinessInfoStep;