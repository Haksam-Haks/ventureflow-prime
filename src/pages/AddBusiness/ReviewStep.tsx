import React from 'react';
// Attachments config
const ATTACHMENTS = [
  { label: 'Certified Copy Of Registered Business Name', name: 'businessNameCert', required: true, type: 'file' },
  { label: 'Certified Copy Of Trade License', name: 'tradeLicense', required: true, type: 'file' },
  { label: 'Certified Copy Tax Certificate', name: 'taxCert', required: true, type: 'file' },
  { label: 'Passport Photo', name: 'passportPhoto', required: true, type: 'file' },
  { label: 'Nin Number (Upload National ID)', name: 'ninId', required: true, type: 'text' },
];
import { FiCheckCircle, FiAlertCircle, FiMapPin, FiHome, FiDollarSign, FiUser, FiImage, FiPaperclip } from 'react-icons/fi';
import { BusinessRegistrationForm } from '../../types/types';

// Section wrapper component for consistent styling
const SectionWrapper: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ 
  title, 
  icon, 
  children 
}) => (
  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-sm">
    <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-green-300 flex items-center">
      <span className="bg-green-200 text-green-800 p-2 rounded-lg mr-3 flex items-center justify-center">
        {icon}
      </span>
      {title}
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, className = '' }) => (
  <div className={`mb-3 ${className}`}>
    <p className="text-xs font-medium text-green-700 uppercase tracking-wider">{label}</p>
    <p
      className="text-gray-800 font-medium mt-1 bg-white p-2 rounded-md border border-green-100 break-words max-w-full overflow-hidden text-ellipsis"
      style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}
    >
      {value || <span className="text-gray-400">Not provided</span>}
    </p>
  </div>
);

// Render amenities if present
function renderAmenities(values: any) {
  if (!values.amenities || !values.amenities.length) return null;
  return (
    <SectionWrapper title="Amenities" icon={<FiHome size={18} />}>
      <div className="flex flex-wrap gap-2">
        {values.amenities.map((amenity: string, idx: number) => (
          <span 
            key={idx} 
            className="bg-green-200 text-green-900 px-3 py-1.5 rounded-full text-sm font-medium flex items-center"
          >
            <FiCheckCircle className="mr-1.5" size={14} />
            {amenity}
          </span>
        ))}
      </div>
    </SectionWrapper>
  );
}

// Render staff if present
function renderStaff(values: any) {
  if (!values.staff || !values.staff.length) return null;
  return (
    <SectionWrapper title="Staff Members" icon={<FiUser size={18} />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {values.staff.map((staff: any, idx: number) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
            <DetailItem label="Name" value={getDisplayName(staff.name)} />
            <DetailItem label="Email" value={getDisplayName(staff.email)} />
            <DetailItem label="Position" value={getDisplayName(staff.position)} />
            <DetailItem label="Phone 1" value={getDisplayName(staff.contact_phone_1)} />
            <DetailItem label="Phone 2" value={getDisplayName(staff.contact_phone_2)} />
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

const getDisplayName = (name?: string) => {
  if (typeof name === 'string' && name.trim()) return name;
  return null;
};

interface ReviewStepProps {
  values: BusinessRegistrationForm;
  images: File[];
  coverImageIndex: number;
  error?: string;
  onAgree?: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  values,
  images,
  coverImageIndex,
  error
}) => {
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = React.useState<{name: string, urls: string[]}[]>([]);
  // For image modal
  const [modalImage, setModalImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const previews = images.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);

    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  React.useEffect(() => {
    const attachmentKeys = Object.keys(values || {});
    const previewList: {name: string, urls: string[]}[] = [];
    const valuesAny = values as any;
    attachmentKeys.forEach(key => {
      const val = valuesAny[key];
      if (val instanceof File && val.type && val.type.startsWith('image/')) {
        previewList.push({ name: key, urls: [URL.createObjectURL(val)] });
      } else if (Array.isArray(val) && val.length && val[0] instanceof File) {
        const urls = val.filter((f: File) => f.type && f.type.startsWith('image/')).map((f: File) => URL.createObjectURL(f));
        if (urls.length) previewList.push({ name: key, urls });
      }
    });
    setAttachmentPreviews(previewList);
    return () => {
      previewList.forEach(item => item.urls.forEach(url => URL.revokeObjectURL(url)));
    };
  }, [values]);

  const renderBusinessInfo = () => (
    <SectionWrapper title="Business Information" icon={<FiHome size={18} />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailItem label="Business Type" value={getDisplayName(values.businessType)} />
        {values.businessType === 'group' && (
          <DetailItem label="Group Name" value={getDisplayName(values.parentInstitutionName)} />
        )}
        <DetailItem label="Legal Name" value={getDisplayName(values.legalName)} />
        <DetailItem label="Trading Name" value={getDisplayName(values.tradingName)} />
        <DetailItem label="Ownership Type" value={getDisplayName(values.branchType)} />
        <DetailItem label="Displayed Business Name" value={getDisplayName(values.businessName)} />
        <DetailItem label="Website" value={getDisplayName(values.websiteUrl)} />
        <DetailItem label="Contact Phone" value={getDisplayName(values.contactPhone)} />
        <DetailItem label="Email Address" value={getDisplayName(values.emailAddress)} />
        <DetailItem label="Date of Establishment" value={getDisplayName(values.registrationDate)} />
        <DetailItem label="Registration Authority" value={getDisplayName(values.registrationAuthority)} />
      </div>
    </SectionWrapper>
  );

  const renderLocationDetails = () => (
    <SectionWrapper title="Location Details" icon={<FiMapPin size={18} />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailItem label="Region" value={getDisplayName(values.regionName) || getDisplayName(values.region)} />
        <DetailItem label="District" value={getDisplayName(values.districtName) || getDisplayName(values.district)} />
        <DetailItem label="County" value={getDisplayName(values.countyName) || getDisplayName(values.county)} />
        <DetailItem label="Sub-County" value={getDisplayName(values.subCountyName) || getDisplayName(values.subCounty)} />
        <DetailItem label="Parish" value={getDisplayName(values.parishName) || getDisplayName(values.parish)} />
        <DetailItem label="Physical Address" value={getDisplayName(values.physicalAddress)} />
      </div>
    </SectionWrapper>
  );

  const renderBankInfo = () => {
    if (!values.bankAccounts || !values.bankAccounts.length) return null;
    return (
      <SectionWrapper title={`Bank Accounts (${values.bankAccounts.length})`} icon={<FiDollarSign size={18} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {values.bankAccounts.map((account: { bankName: string | undefined; accountName: string | undefined; accountNumber: string | undefined; branch: string | undefined; isPrimary: any; }, idx: React.Key | null | undefined) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
              <DetailItem label="Bank" value={getDisplayName(account.bankName)} />
              <DetailItem label="Account Name" value={getDisplayName(account.accountName)} />
              <DetailItem label="Account Number" value={getDisplayName(account.accountNumber)} />
              <DetailItem label="Branch" value={getDisplayName(account.branch)} />
              <DetailItem label="Primary" value={account.isPrimary ? 'Yes' : 'No'} />
            </div>
          ))}
        </div>
      </SectionWrapper>
    );
  };

const renderContacts = () => {
  if (!values.contacts || !values.contacts.length) return null;
  return (
    <SectionWrapper title={`Contacts (${values.contacts.length})`} icon={<FiUser size={18} />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {values.contacts.map((contact, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
            <DetailItem label="Name" value={getDisplayName(contact.name)} />
            <DetailItem label="Email" value={getDisplayName(contact.email)} />
            <DetailItem label="Phone" value={getDisplayName(contact.phone)} />
            <DetailItem label="Alternate Phone" value={getDisplayName(contact.alternatePhone)} />
            <DetailItem label="Physical Address" value={getDisplayName(contact.physicalAddress)} />
            <DetailItem label="Primary" value={contact.isPrimary ? 'Yes' : 'No'} />
            <DetailItem label="Parish" value={getDisplayName(contact.parish)} />
            <DetailItem label="Sub-County" value={getDisplayName(contact.subCounty)} />
            <DetailItem label="County" value={getDisplayName(contact.county)} />
            <DetailItem label="District" value={getDisplayName(contact.district)} />
            <DetailItem label="Region" value={getDisplayName(contact.region)} />
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

  const renderBusinessImages = () => {
    if (!images.length) return null;
    return (
      <SectionWrapper title={`Business Images (${images.length})`} icon={<FiImage size={18} />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {imagePreviews.map((src, index) => (
            <div key={index} className="relative group">
              <img
                src={src}
                alt={`Business ${index}`}
                className="w-full h-32 object-cover rounded-lg shadow-sm border-2 border-gray-100 group-hover:border-green-300 transition-all"
              />
              {coverImageIndex === index && (
                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md shadow-md">
                  Cover Image
                </span>
              )}
            </div>
          ))}
        </div>
      </SectionWrapper>
    );
  };

  const renderAttachments = () => {
    if (!ATTACHMENTS.length) return null;
    return (
      <SectionWrapper title="Uploaded Attachments" icon={<FiPaperclip size={18} />}>
        <div className="space-y-4">
          {ATTACHMENTS.map(att => {
            // File attachments
            if (att.type === 'file') {
              const preview = attachmentPreviews.find(a => a.name === att.name);
              return (
                <div key={att.name}>
                  <div className="text-sm font-medium text-green-700 mb-2">{att.label}</div>
                  <div className="flex flex-wrap gap-3">
                    {preview && preview.urls.length > 0 ? preview.urls.map((url, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={url}
                          alt={att.label + '-' + idx}
                          className="h-20 rounded-md border border-green-200 object-cover shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setModalImage(url)}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1 text-white text-xs truncate">
                          {att.label}-{idx+1}
                        </div>
                      </div>
                    )) : (
                      <span className="text-gray-400 text-xs">Not uploaded</span>
                    )}
                  </div>
                </div>
              );
            }
            // Text attachments (e.g. ninId)
            if (att.type === 'text') {
              return (
                <div key={att.name}>
                  <div className="text-sm font-medium text-green-700 mb-2">{att.label}</div>
                  <div className="bg-white border border-green-100 rounded px-3 py-2 text-green-900 text-sm">
                    {getDisplayName((values as any)[att.name]) || <span className="text-gray-400">Not provided</span>}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        {/* Image modal */}
        {modalImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setModalImage(null)}>
            <div className="relative max-w-3xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
              <img src={modalImage} alt="Preview" className="max-h-[80vh] w-auto rounded-lg shadow-2xl border-4 border-white" />
              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
                onClick={() => setModalImage(null)}
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </SectionWrapper>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Review Your Business Details</h2>
        <p className="text-green-600 flex items-center justify-center text-lg">
          <FiCheckCircle className="mr-2" size={20} />
          Please verify all information before submitting
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start border border-red-200 shadow-sm">
          <FiAlertCircle className="mr-3 mt-0.5 flex-shrink-0" size={20} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {renderBusinessInfo()}
          {renderContacts()}
          {renderAmenities(values)}
          {renderStaff(values)}
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          {renderLocationDetails()}
          {renderBankInfo()}
          {renderBusinessImages()}
          {renderAttachments()}
        </div>
      </div>

      {/* Fallback if all sections are empty */}
      {!(values && (Object.keys(values).length > 0)) && images.length === 0 && (
        <div className="text-center text-gray-500 py-8 bg-green-50 rounded-lg">
          No data to review. Please fill in the previous steps.
        </div>
      )}
    </div>
  );
};

export default ReviewStep;