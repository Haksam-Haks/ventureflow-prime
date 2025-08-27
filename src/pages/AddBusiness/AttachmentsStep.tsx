import React from 'react';

interface Attachment {
  label: string;
  name: string;
  required?: boolean;
  type?: 'file' | 'select' | 'checkbox' | 'text';
  options?: string[];
}

const ATTACHMENTS: Attachment[] = [
  { label: 'Certified Copy Of Registered Business Name', name: 'businessNameCert', required: true, type: 'file' },
  { label: 'Certified Copy Of Trade License', name: 'tradeLicense', required: true, type: 'file' },
  { label: 'Certified Copy Tax Certificate', name: 'taxCert', required: true, type: 'file' },
  { label: 'Passport Photo', name: 'passportPhoto', required: true, type: 'file' },
  { label: 'NIN Number', name: 'ninNumber', required: true, type: 'text' },
];

interface AttachmentsStepProps {
  values: Record<string, any>;
  setValues: (v: Record<string, any>) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

const AttachmentsStep: React.FC<AttachmentsStepProps> = ({ values, setValues, errors = {}, disabled }) => {
  const [previews, setPreviews] = React.useState<Record<string, string | string[]>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const initialTouched: Record<string, boolean> = {};
    ATTACHMENTS.forEach(att => {
      initialTouched[att.name] = false;
    });
    setTouched(initialTouched);
  }, []);

  // NIN validation helpers
  const NIN_ALLOWED_REGEX = /^[A-Z0-9]*$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value, files, checked } = e.target as any;
    setTouched(prev => ({ ...prev, [name]: true }));

    if (name === 'ninNumber') {
      let nin = value.toUpperCase();
      nin = nin.replace(/[^A-Z0-9]/g, '');
      if (nin.length > 14) nin = nin.slice(0, 14);
      // Custom error logic
      let ninError = '';
      if (nin.length > 0 && !NIN_ALLOWED_REGEX.test(nin)) {
        ninError = 'Only uppercase letters (A–Z) and numbers (0–9) allowed.';
      } else if (nin.length > 0 && nin.length < 14) {
        ninError = 'NIN must be exactly 14 characters.';
      }
      setValues({ ...values, ninNumber: nin, ninId: nin });
      // If parent provides setErrors, update errors here (for live blocking)
      if (typeof errors === 'object') {
        errors.ninNumber = ninError;
      }
      return;
    }


    if (type === 'file') {
      if (files.length > 1) {
        const fileArr = Array.from(files) as File[];
        setValues({ ...values, [name]: fileArr });
        const urls = fileArr.map(file =>
          file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
        );
        setPreviews(prev => ({ ...prev, [name]: urls.filter(Boolean) }));
      } else {
        const file = files[0];
        setValues({ ...values, [name]: file });
        setPreviews(prev => ({
          ...prev,
          [name]: file?.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        }));
      }
    } else if (type === 'checkbox') {
      setValues({ ...values, [name]: checked });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Required Attachments</h2>
      <form className="space-y-6">
        {ATTACHMENTS.map(att => (
          <div key={att.name} className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">
              {att.label}
              {att.required && <span className="text-red-500 ml-1">*</span>}
            </label>


            {att.type === 'file' && (
              <>
                <input
                  type="file"
                  id={`attachment-${att.name}`}
                  name={att.name}
                  onChange={e => {
                    handleChange(e);
                    setTouched(prev => ({ ...prev, [att.name]: true }));
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, [att.name]: true }))}
                  disabled={disabled}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    (touched[att.name] && (errors[att.name] || (!values[att.name] && att.required))) ? 'border-red-500' : 'border-gray-300'
                  }`}
                  data-error={!!errors[att.name]}
                  required={!!att.required}
                  accept={'image/*'}
                />

                {/* Image preview for file fields (not for NIN) */}
                {previews[att.name] && (
                  Array.isArray(previews[att.name]) ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(previews[att.name] as string[]).map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt="preview"
                          className="h-20 rounded border"
                          onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                        />
                      ))}
                    </div>
                  ) : (
                    previews[att.name] && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <img
                          src={previews[att.name] as string}
                          alt="preview"
                          className="h-20 rounded border"
                          onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                        />
                      </div>
                    )
                  )
                )}
                {/* Show error only if touched */}
                {touched[att.name] && errors[att.name] && (
                  <span className="text-red-500 text-sm">{errors[att.name]}</span>
                )}
                {touched[att.name] && att.required && (
                  (() => {
                    if (att.type === 'file') {
                      const val = values[att.name];
                      if (!val || (Array.isArray(val) && val.length === 0)) {
                        return <span className="text-red-500 text-sm">{`${att.label} is required`}</span>;
                      }
                    } else {
                      if (!values[att.name]) {
                        return <span className="text-red-500 text-sm">{`${att.label} is required`}</span>;
                      }
                    }
                    return null;
                  })()
                )}
              </>
            )}

            {att.type === 'text' && (
              <>
                <input
                  type="text"
                  id={`attachment-${att.name}`}
                  name={att.name}
                  value={values[att.name] || ''}
                  onChange={e => {
                    handleChange(e);
                    setTouched(prev => ({ ...prev, [att.name]: true }));
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, [att.name]: true }))}
                  disabled={disabled}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    (errors[att.name] || (!values[att.name] && att.required)) ? 'border-red-500' : 'border-gray-300'
                  }`}
                  data-error={!!errors[att.name]}
                  required={!!att.required}
                  maxLength={14}
                  pattern={'[A-Z0-9]+'}
                  inputMode={'text'}
                  autoCapitalize={'characters'}
                  placeholder={'e.g. CM75032101XE1'}
                />
                {/* Show error only if touched */}
                {touched[att.name] && errors[att.name] && (
                  <span className="text-red-500 text-sm">{errors[att.name]}</span>
                )}
                {/* NIN custom validation errors */}
                {att.name === 'ninNumber' && touched[att.name] && (
                  (() => {
                    const nin = values[att.name] || '';
                    if (nin.length > 0 && !NIN_ALLOWED_REGEX.test(nin)) {
                      return <span className="text-red-500 text-sm">Only uppercase letters (A–Z) and numbers (0–9) allowed.</span>;
                    }
                    if (nin.length > 0 && nin.length < 14) {
                      return <span className="text-red-500 text-sm">NIN must be exactly 14 characters.</span>;
                    }
                  
                    return null;
                  })()
                )}
                {/* Improved required validation for text fields (no whitespace-only) and file fields */}
                {touched[att.name] && att.required && (
                  (() => {
                    if (att.type && att.type.toString() === 'file') {
                      const val = values[att.name];
                      if (!val || (Array.isArray(val) && val.length === 0)) {
                        return <span className="text-red-500 text-sm">{`${att.label} is required`}</span>;
                      }
                    } else if (att.type && att.type.toString() === 'text') {
                      const val = values[att.name];
                      if (!val || (typeof val === 'string' && val.trim() === '')) {
                        return <span className="text-red-500 text-sm">{`${att.label} is required`}</span>;
                      }
                    }
                    return null;
                  })()
                )}
              </>
            )}
          </div>
        ))}
      </form>
    </div>
  );
};

export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const getAttachmentsAsBase64 = async (values: Record<string, any>) => {
  return {
    businessNameCert: values.businessNameCert ? await toBase64(values.businessNameCert) : '',
    tradeLicense: values.tradeLicense ? await toBase64(values.tradeLicense) : '',
    taxCert: values.taxCert ? await toBase64(values.taxCert) : '',
    passportPhoto: values.passportPhoto ? await toBase64(values.passportPhoto) : '',
    ninId: values.ninId || '',
  };
};

export default AttachmentsStep;
