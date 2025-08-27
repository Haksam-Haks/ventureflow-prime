import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useUser } from '../../contexts/UserContext';
import BusinessInfoStep from '../AddBusiness/BusinessInfoStep';
import AddressStep from '../AddBusiness/AddressStep';
import BankStep from '../AddBusiness/BankStep';
import ImagesStep from '../AddBusiness/ImagesStep';
import ContactStep from '../AddBusiness/ContactStep';
import ThankYouStep from '../AddBusiness/ThankYouStep';
import ReviewStep from '../AddBusiness/ReviewStep';
import AttachmentsStep, { getAttachmentsAsBase64 } from '../AddBusiness/AttachmentsStep';
import {
  businessInfoSchema,
  addressStepSchema,
  bankStepSchema,
  contactStepSchema,
  attachmentsStepSchema,
  imagesStepSchema
} from '../../utils/registrationSchemas';
import type { BusinessRegistrationForm as BusinessRegistrationFormType, BankAccount as BankAccountType, Contact as ContactType } from '../../types/types';
import { ArrowLeft, Building, MapPin, Phone } from 'lucide-react';
import apiService from '../../services/apiService';

interface RegistrationStepperProps {
  steps: string[];
  currentStep: number;
}

type BusinessFormData = BusinessRegistrationFormType;
type BankAccount = BankAccountType;

const RegistrationStepper: React.FC<RegistrationStepperProps> = ({ steps, currentStep }) => (
  <div className="mb-8">
    <div className="flex justify-between">
      {steps.map((step, i) => (
        <div key={step} className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 
            ${currentStep === i
              ? 'bg-green-600 text-white border-green-600 shadow-lg'
              : i < currentStep
                ? 'bg-white text-green-700 border-green-400'
                : 'bg-white text-gray-800 border-gray-300'}`}
          >
            {i < currentStep ? <FiCheck /> : i + 1}
          </div>
          <span className={`mt-2 text-sm font-bold ${currentStep === i ? 'text-green-700' : 'text-gray-800'}`}>{step}</span>
        </div>
      ))}
    </div>
    <div className="relative mt-2">
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/60"></div>
      <div 
        className="absolute top-0 left-0 h-1 bg-green-600 transition-all duration-300"
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
      ></div>
    </div>
  </div>
);

const initialValues: BusinessFormData = {
  legalName: '',
  tradingName: '',
  businessName: '',
  businessType: '',
  sector: '',
  subSector: '',
  industryCategory: '',
  contacts: [],
  regionId: '',
  districtId: '',
  countyId: '',
  subCountyId: '',
  parishId: '',
  physicalAddress: '',
  bankAccounts: [],
  agreeTo: false,
};

const getUserId = (user: any) => {
  if (!user) return '';
  if (typeof user.id === 'string' || typeof user.id === 'number') return user.id;
  if (user.id && (typeof user.id.id === 'string' || typeof user.id.id === 'number')) return user.id.id;
  return '';
};

const BusinessRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<BusinessFormData>(initialValues);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showTermsModal, setShowTermsModal] = useState(false);

  const { user } = useUser();
  const navigate = useNavigate();

  const steps = [
    'Business Info',
    'Address',
    'Bank Info',
    'Contacts',
    'Images',
    'Attachments',
    'Review'
  ];


  // Async Zod-based step validation
  // Async Zod-based step validation with strict required/optional logic
  const validateStepAsync = async (values: BusinessFormData, step: number): Promise<{ valid: boolean; errors: { [key: string]: string } }> => {
    let errors: { [key: string]: string } = {};
    try {
      let schemaResult;
      switch (step) {
        case 0:
          schemaResult = businessInfoSchema.safeParse(values);
          break;
        case 1:
          schemaResult = addressStepSchema.safeParse(values);
          break;
        case 2:
          schemaResult = bankStepSchema.safeParse({ bankAccounts: values.bankAccounts });
          break;
        case 3:
          schemaResult = contactStepSchema.safeParse({ contacts: values.contacts });
          break;
        case 4:
          schemaResult = imagesStepSchema.safeParse({ images, coverImageIndex });
          break;
        case 5:
          schemaResult = attachmentsStepSchema.safeParse(values);
          break;
        case 6:
          if (!values.agreeTo) errors.agreeTo = 'You must agree to the terms & conditions.';
          break;
        default:
          break;
      }
      if (schemaResult && !schemaResult.success) {
        schemaResult.error.issues.forEach((e: any) => {
          if (e.path && e.path.length > 0) {
            const key = e.path[0] as keyof BusinessRegistrationFormType;
            // Only show error for required or filled optional fields
            if (
              key in values &&
              values[key] !== undefined &&
              values[key] !== null &&
              values[key] !== ''
            ) {
              errors[key as string] = e.message;
            } else if (e.message && /required/i.test(e.message)) {
              errors[key as string] = e.message;
            }
          }
        });
      }
    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        err.errors.forEach((e: any) => {
          if (e.path && e.path.length > 0) {
            const key = e.path[0] as keyof BusinessRegistrationFormType;
            if (values[key] !== undefined && values[key] !== null && values[key] !== '') {
              errors[key as string] = e.message;
            } else if (e.message && /required/i.test(e.message)) {
              errors[key as string] = e.message;
            }
          }
        });
      }
    }
    const valid = Object.keys(errors).length === 0;
    return { valid, errors };
  };



  const nextStep = async () => {
    // Always revalidate on nextStep click (async)
    let { valid, errors } = await validateStepAsync(formValues, currentStep);

    // Custom NIN validation for Attachments step
    if (currentStep === 5) {
      const nin = formValues.ninId || '';
      const ninAllowed = /^[A-Z0-9]{0,14}$/.test(nin);
      if (!ninAllowed || nin.length !== 14) {
        errors.ninId = !ninAllowed
          ? 'Only uppercase letters (A–Z) and numbers (0–9) allowed.'
          : 'NIN must be exactly 14 characters.';
        valid = false;
      } else {
        // Remove error if valid
        if (errors.ninId) delete errors.ninId;
      }
    }

    setFormErrors(errors);
    if (!valid) {
      // Block navigation and focus first error
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const el = document.querySelector(`[data-error="${firstErrorKey}"]`);
        if (el && typeof (el as HTMLElement).focus === 'function') {
          (el as HTMLElement).focus();
        }
      }
      return false;
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    return true;
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    const { sendPostToServerMult } = apiService();
    // Only include fields collected from AddBusiness steps
    const filteredContacts = Array.isArray(formValues.contacts)
      ? formValues.contacts.filter(c => c.name && c.name.trim() !== '')
      : [];

    if (filteredContacts.length === 0) {
      toast.error('At least one valid contact (with name) is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading('Registering your business...');

      const userId = getUserId(user);

      const getPrimaryContactEmail = () => {
        if (formValues.contacts && formValues.contacts.length > 0) {
          const primary = formValues.contacts.find((c: any) => c.isPrimary) || formValues.contacts[0];
          return primary.email || '';
        }
        return '';
      };

      // Business Info fields
      const businessName = formValues.businessName || formValues.legalName;
      const contactEmail = formValues.emailAddress || getPrimaryContactEmail();

      // Clean object utility
      const cleanObject = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(cleanObject).filter((v) => v !== undefined && v !== null);
        } else if (typeof obj === 'object' && obj !== null) {
          const cleaned: any = {};
          Object.entries(obj).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') {
              cleaned[k] = cleanObject(v);
            }
          });
          return cleaned;
        }
        return obj;
      };



  // Convert attachments to base64 strings
  const attachments = await getAttachmentsAsBase64(formValues);

    // Convert images to base64 strings for JSON submission
    const toBase64 = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

    const imagesBase64 = await Promise.all(images.map(img => toBase64(img)));

    // Build full DTO with all fields from all steps
    const fullBusinessDTO = {
      business: {
        businessType: formValues.businessType,
        ...(formValues.hasOwnProperty('businessTypeId') ? { businessTypeId: (formValues as any).businessTypeId } : {}),
        legalName: formValues.legalName,
        tradingName: formValues.tradingName,
        businessName,
        name: formValues.legalName,
        contactEmail,
        status: 'PENDING',
        createdBy: userId,
        lastUpdatedBy: userId,
        registrationDate: formValues.registrationDate,
        websiteUrl: formValues.websiteUrl,
        branchType: formValues.branchType,
        contactPhone: formValues.contactPhone,
        emailAddress: formValues.emailAddress,
        registrationAuthority: formValues.registrationAuthority,
      },
      address: {
        country: formValues.country,
        parish: formValues.parish,
        parishId: formValues.parishId,
        subCounty: formValues.subCounty,
        subCountyId: formValues.subCountyId,
        county: formValues.county,
        countyId: formValues.countyId,
        district: formValues.district,
        districtId: formValues.districtId,
        region: formValues.region,
        regionId: formValues.regionId,
        physicalAddress: formValues.physicalAddress,
        regionName: formValues.regionName,
        districtName: formValues.districtName,
        countyName: formValues.countyName,
        subCountyName: formValues.subCountyName,
        parishName: formValues.parishName,
        createdBy: userId,
        lastUpdatedBy: userId,
      },
      contacts: filteredContacts.map(c => ({
        name: c.name,
        email: c.email,
        phone: c.phone,
        alternatePhone: c.alternatePhone,
        position: c.position,
        physicalAddress: c.physicalAddress,
        isPrimary: c.isPrimary,
        parish: c.parish,
        parishId: c.parishId,
        subCounty: c.subCounty,
        subCountyId: c.subCountyId,
        county: c.county,
        countyId: c.countyId,
        district: c.district,
        districtId: c.districtId,
        region: c.region,
        regionId: c.regionId,
      })),
      businessBankAccounts: (formValues.bankAccounts || []).map(acc => ({
        id: acc.id,
        bankId: acc.bankId,
        bankName: acc.bankName,
        accountNumber: acc.accountNumber,
        accountName: acc.accountName,
        branch: acc.branch,
        accountType: acc.accountType,
        isPrimary: acc.isPrimary,
      })),
      attachments,
      images: imagesBase64,
      coverImageIndex,
    };

    const cleanDTO = cleanObject(fullBusinessDTO);

    console.log('Submitting businessData:', cleanDTO);

    const response = await sendPostToServerMult(
      'businesses/register',
      cleanDTO
    ) as { success?: boolean; message?: string };

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to create business');
      }

      toast.dismiss(loadingToast);
      toast.success('Business registered successfully!');
      setCurrentStep(prev => prev + 1);

    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.dismiss();

      let errorMessage = 'Failed to register business';
      if (error.message?.includes('401')) {
        errorMessage = 'Session expired. Please login again';
        navigate('/login');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-2 md:p-4" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      <div className="w-full h-[98vh] max-w-[1800px] backdrop-blur-lg bg-gradient-to-br from-[#0079C1]/60 via-[#00AEEF]/30 to-[#7ED321]/30 rounded-2xl shadow-xl overflow-hidden border border-white/30 flex flex-col justify-center">
        <div className="md:flex h-full">
          {/* Left side - Branding */}
          <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-[#0079C1]/90 via-[#00AEEF]/90 to-[#7ED321]/90 p-8 text-white">
            <div className="flex flex-col h-full justify-between">
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full shadow-lg p-2 mb-6 flex items-center justify-center" style={{ width: '80px', height: '80px' }}>
                  <img 
                    src={import.meta.env.BASE_URL + 'logo/egret other-04.png'} 
                    alt="Egret Hospitality Logo" 
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#fff' }}>Register Your Business</h2>
                <p className="text-white/90 text-center">
                  Join our network and unlock new opportunities for your business in hospitality.
                </p>
              </div>
              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <div className="bg-white/20 rounded-full p-2 mr-3 backdrop-blur-sm">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <span>Verified business listing</span>
                </div>
                <div className="flex items-center mb-4">
                  <div className="bg-white/20 rounded-full p-2 mr-3 backdrop-blur-sm">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <span>Location visibility</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full p-2 mr-3 backdrop-blur-sm">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <span>Direct customer contact</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="md:w-2/3 p-6 bg-white/30 shadow-xl h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#00AEEF] scrollbar-track-white/10 backdrop-blur-lg border border-white/30 rounded-2xl">
            <div className="mb-2">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-white hover:text-[#00AEEF] transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
            </div>

            {currentStep < steps.length ? (
              <>
                <div className="text-center md:text-left mb-6">
                  <h2 className="text-2xl font-bold text-white">Business Registration</h2>
                  <p className="text-white/80 mt-1">
                    Step {currentStep + 1} of {steps.length}
                  </p>
                </div>
                
                <RegistrationStepper steps={steps} currentStep={currentStep} />
                
                <div className="space-y-6">
                  {currentStep === 0 && (
                    <BusinessInfoStep
                      values={formValues}
                      onChange={(fields: Partial<BusinessFormData>) => {
                        if (fields.legalName !== undefined) {
                          setFormValues(prev => ({ ...prev, ...fields, businessName: fields.legalName }));
                        } else {
                          setFormValues(prev => ({ ...prev, ...fields }));
                        }
                      }}
                      errors={formErrors}
                      setErrors={setFormErrors}
                      disabled={isSubmitting}
                    />
                  )}
                  {currentStep === 1 && (
                    <AddressStep
                      values={formValues}
                      onChange={fields => setFormValues(prev => ({ ...prev, ...fields }))}
                      errors={formErrors}
                      disabled={isSubmitting}
                    />
                  )}
                  {currentStep === 2 && (
                    <BankStep
                      bankAccounts={formValues.bankAccounts}
                      onChange={(bankAccounts: BankAccount[]) => setFormValues(prev => ({ ...prev, bankAccounts }))}
                      errors={formErrors}
                      disabled={isSubmitting}
                    />
                  )}
                  {currentStep === 3 && (
                    <ContactStep
                      contacts={formValues.contacts}
                      onChange={(contacts: ContactType[]) => setFormValues(prev => ({ ...prev, contacts: contacts as any }))}
                      errors={formErrors}
                      disabled={isSubmitting}
                    />
                  )}
                  {currentStep === 4 && (
                    <ImagesStep
                      images={images}
                      setImages={setImages}
                      coverImageIndex={coverImageIndex}
                      setCoverImageIndex={setCoverImageIndex}
                      disabled={isSubmitting}
                    />
                  )}
                  {currentStep === 5 && (
                    <AttachmentsStep
                      values={{ ...formValues, ninNumber: formValues.ninId }}
                      setValues={fields => {
                        // Map ninNumber to ninId for validation
                        const mapped = { ...fields };
                        if ('ninNumber' in mapped) {
                          mapped.ninId = mapped.ninNumber;
                          delete mapped.ninNumber;
                        }
                        setFormValues(prev => ({ ...prev, ...mapped }));
                      }}
                      errors={formErrors}
                    />
                  )}
                  {currentStep === 6 && (
                    <ReviewStep
                      values={formValues}
                      images={images}
                      coverImageIndex={coverImageIndex}
                    />
                  )}
                  {/* Navigation Buttons */}
                  {currentStep < steps.length - 1 && (
                    <div className="flex justify-between mt-8 border-t border-white/20 pt-6">
                      {currentStep > 0 && (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex items-center px-6 py-2 rounded-lg text-white bg-teal-500 hover:bg-teal-600 transition-colors"
                          disabled={isSubmitting}
                        >
                          <FiChevronLeft className="mr-2" /> Previous
                        </button>
                      )}
                      {currentStep === 6 ? (
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="ml-auto flex items-center justify-center px-6 py-2 rounded-lg text-white bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                          disabled={isSubmitting}
                        >
                          Terms & Conditions
                        </button>
                      ) : (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="ml-auto flex items-center justify-center px-6 py-2 rounded-lg text-white bg-gradient-to-r from-[#00AEEF] to-[#0079C1] hover:from-[#0079C1] hover:to-[#00AEEF] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                        disabled={isSubmitting}
                      >
                        Next <FiChevronRight className="ml-2" />
                      </button>
                      )}
                    </div>
                  )}
                  {currentStep === steps.length - 1 && (
                    <div className="flex justify-between mt-8 border-t border-white/20 pt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center px-6 py-2 rounded-lg text-white bg-[#00AEEF] hover:bg-[#0079C1] transition-colors"
                        disabled={isSubmitting}
                      >
                        <FiChevronLeft className="mr-2" /> Previous
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="ml-auto flex items-center justify-center px-6 py-2 rounded-lg text-white bg-gradient-to-r from-[#00AEEF] to-[#0079C1] hover:from-[#0079C1] hover:to-[#00AEEF] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <React.Fragment>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            Submit Registration
                            <FiCheck className="ml-2" />
                          </React.Fragment>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                {/* Terms & Conditions Modal */}
                {showTermsModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 p-8 flex flex-col items-center relative">
                      <h3 className="text-xl font-bold mb-4 text-center" style={{ color: '#0079C1' }}>Terms & Conditions</h3>
                      <div className="text-gray-700 text-sm max-h-96 overflow-y-auto mb-6 text-left w-full">
                        {/* Replace this with your actual terms content */}
                        <p>
                          By registering your business, you agree to abide by all platform rules and regulations. Please review all terms carefully before proceeding. Your data will be handled securely and in accordance with our privacy policy. For more information, contact support.
                        </p>
                        <ul className="list-disc pl-5 mt-2">
                          <li>Provide accurate and truthful information.</li>
                          <li>Comply with all applicable laws and regulations.</li>
                          <li>Respect customer privacy and data protection.</li>
                          <li>Platform reserves the right to verify and approve listings.</li>
                        </ul>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormValues(prev => {
                            const updated = { ...prev, agreeTo: true };
                            setTimeout(() => {
                              setShowTermsModal(false);
                              validateStepAsync(updated, currentStep).then(({ valid, errors }) => {
                                setFormErrors(errors);
                                if (valid) {
                                  setCurrentStep(step => Math.min(step + 1, steps.length - 1));
                                }
                              });
                            }, 0);
                            return updated;
                          });
                        }}
                        className="w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-[#00AEEF] to-[#0079C1] hover:from-[#0079C1] hover:to-[#00AEEF] focus:outline-none focus:ring-2 focus:ring-[#00AEEF] transition-colors"
                      >
                        I Agree & Continue
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                        aria-label="Close"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <ThankYouStep
                businessName={formValues.businessName || formValues.legalName}
                contactEmail={formValues.emailAddress || ''}
                contactPhone={formValues.contactPhone || ''}
                businessType={formValues.businessType || ''}
                registrationAuthority={formValues.registrationAuthority || ''}
                physicalAddress={formValues.physicalAddress || ''}
                registrationStatus="Pending Review"
                primaryContact={{ name: '', email: '', phone: '' }}
                primaryBankAccount={{ bankName: '', accountNumber: '', accountName: '', branch: '', accountType: '' }}
                imageUrl={
                  images && images[coverImageIndex]
                    ? (typeof images[coverImageIndex] === 'string'
                        ? images[coverImageIndex]
                        : images[coverImageIndex] instanceof File
                          ? URL.createObjectURL(images[coverImageIndex])
                          : '')
                    : ''
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistrationForm;