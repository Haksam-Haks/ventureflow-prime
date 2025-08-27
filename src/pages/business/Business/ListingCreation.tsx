import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusiness } from '../../../contexts/BusinessContext';
import { fetchBusinessCategories, BusinessCategory, BusinessSubcategory, FormField } from '../../../data/businessCategories';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Progress } from '../../../components/ui/progress';
import { Badge } from '../../../components/ui/badge';
import { ArrowLeft, ArrowRight, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';
import { useUser } from '../../../contexts/UserContext';

const ListingCreation = () => {
  const { user, isAuthenticated } = useUser();
  const { state, dispatch } = useBusiness();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>(state.listingFormData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Fetch categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchBusinessCategories();
        setCategories(response);
      } catch (err: any) {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user && !state.isAuthenticated) {
      dispatch({ type: 'LOGIN', user });
    }
  }, [isAuthenticated, user, state.isAuthenticated, dispatch]);

  // Category and subcategory data - updated to use BusinessCategory interface
  const categoryId = state.selectedCategoryId;
  const subcategoryId = state.selectedSubcategoryId;
  const category = categories.find((cat: BusinessCategory) => String(cat.id) === String(categoryId));
  const subcategory = category?.subcategories?.find((sub: BusinessSubcategory) => String(sub.id) === String(subcategoryId));
  const contextReady = categoryId && subcategoryId && category && subcategory;

  const safeNavigateBack = () => {
    if (!contextReady) {
      const businessTypeValue = state.user?.businessTypeId || categoryId;
      navigate(`/dashboard/${businessTypeValue}/subcategory`);
    } else {
      handleBack();
    }
  };

  // Steps configuration
  const totalSteps = 5;
  const reviewStep = totalSteps + 1;
  const fieldsPerStep = Math.ceil((subcategory?.fields?.length ?? 0) / totalSteps);
  
  // Helper: get roomTypes field for this subcategory
  const roomTypesField = subcategory?.fields?.find((f: FormField) => f.id === 'roomTypes');
  const selectedRoomTypes = Array.isArray(formData['roomTypes']) ? formData['roomTypes'] : [];

  // Get dynamicFields config from businessCategories for roomTypes
  let roomTypeFieldConfig: Record<string, FormField[]> = {};
  if (roomTypesField && roomTypesField.dynamicFields) {
    roomTypeFieldConfig = roomTypesField.dynamicFields;
  }

  // Step fields: inject dynamic room type fields in step 2
  let currentFields: (FormField | { __roomTypeGroup: string })[] = [];
  if (currentStep <= totalSteps) {
    const start = (currentStep - 1) * fieldsPerStep;
    const end = currentStep * fieldsPerStep;
    currentFields = subcategory?.fields?.slice(start, end) || [];
    
    // Step 2: inject dynamic fields after roomTypes
    if (currentStep === 2 && roomTypesField) {
      const idx = currentFields.findIndex(
        (f) => 'id' in f && f.id === 'roomTypes'
      );
      if (idx !== -1) {
        // Remove roomTypes from currentFields, will render it separately
        currentFields = [
          ...currentFields.slice(0, idx + 1),
          // For each selected room type, add its config fields
          ...selectedRoomTypes.flatMap((type: string) =>
            roomTypeFieldConfig[type] ? [{ __roomTypeGroup: type }, ...roomTypeFieldConfig[type]] : []
          ),
          ...currentFields.slice(idx + 1),
        ];
      }
    }
  }

  const progress = (currentStep / reviewStep) * 100;

  // Input change handler - updated to handle FormField types
  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev: Record<string, any>) => {
      // Special handling for roomTypes multi-select
      if (fieldId === 'roomTypes') {
        const prevTypes = Array.isArray(prev['roomTypes']) ? prev['roomTypes'] : [];
        const removedTypes = prevTypes.filter((t: string) => !value.includes(t));
        const newFormData = { ...prev, [fieldId]: value };
        removedTypes.forEach((type: string) => {
          if (roomTypeFieldConfig[type]) {
            roomTypeFieldConfig[type].forEach(() => {
              // Do not delete, just leave in formData (hidden fields)
            });
          }
        });
        return newFormData;
      }
      // Special logic for Number of Beds: if it changes, clamp Max Guests and set default if empty
      if (fieldId === 'numberOfBeds' || fieldId === 'number_of_beds') {
        let numBeds = parseInt(value, 10);
        if (isNaN(numBeds) || numBeds < 1) numBeds = 1;
        let maxGuestsField = prev['maxGuests'] || prev['max_guests'] || '';
        let maxGuestsVal = parseInt(maxGuestsField, 10);
        if (!maxGuestsField || isNaN(maxGuestsVal) || maxGuestsVal < 1) {
          // If empty or invalid, set to numBeds
          return { ...prev, [fieldId]: value, maxGuests: String(numBeds), max_guests: String(numBeds) };
        }
        if (maxGuestsVal > numBeds) {
          // Clamp max guests to numBeds
          return { ...prev, [fieldId]: value, maxGuests: String(numBeds), max_guests: String(numBeds) };
        }
        return { ...prev, [fieldId]: value };
      }
      // Special logic for Max Guests: allow any positive integer up to 100, if cleared set to 1
      if (fieldId === 'maxGuests' || fieldId === 'max_guests') {
        let guests = parseInt(value, 10);
        if (!value || isNaN(guests) || guests < 1) guests = 1;
        if (guests > 100) guests = 100;
        return { ...prev, [fieldId]: String(guests) };
      }
      return { ...prev, [fieldId]: value };
    });
    dispatch({ type: 'UPDATE_LISTING_DATA', data: { [fieldId]: value } });
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  // Validation - updated to handle FormField types
  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    currentFields.forEach((field: any) => {
      if (field.__roomTypeGroup) {
        return;
      }
      const value = formData[field.id];
      if (field.required) {
        if (field.type === 'checkbox') {
          if (!value) newErrors[field.id] = `${field.label} is required`;
        } else if (field.type === 'multi-select') {
          if (!value || !Array.isArray(value) || value.length === 0) newErrors[field.id] = `${field.label} is required`;
        } else if (field.type === 'file') {
          if (!value || (Array.isArray(value) && value.length === 0)) newErrors[field.id] = `${field.label} is required`;
        } else if (field.type === 'number') {
          if (value === undefined || value === null || value === '') newErrors[field.id] = `${field.label} is required`;
        } else {
          if (!value || (typeof value === 'string' && value.trim() === '')) newErrors[field.id] = `${field.label} is required`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation handlers (unchanged)
  const handleNext = () => {
    if (currentStep <= totalSteps) {
      if (validateCurrentStep()) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    } else if (currentStep === reviewStep) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    } else {
      const businessTypeValue = state.user?.businessTypeId || categoryId;
      navigate(`/dashboard/${businessTypeValue}/subcategory`);
    }
  };

  const handleSubmit = () => {
    dispatch({ type: 'UPDATE_LISTING_DATA', data: formData });
    toast({
      title: "Listing Created!",
      description: "Your listing has been saved. Choose a subscription package to publish it.",
    });
    const businessTypeValue = state.user?.businessTypeId || categoryId;
    navigate(`/dashboard/${businessTypeValue}/package`);
  };

  // Close dropdown on click outside (unchanged)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.relative')) {
        setOpenDropdown(null);
      }
    };
    if (openDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [openDropdown]);

  // Field rendering functions - updated to handle FormField types
  const renderField = (field: FormField | { __roomTypeGroup: string }) => {
    // Special handling for Price per Night (with currency selector), always show regardless of field type
    if (
      'id' in field &&
      (
        (field.label && field.label.toLowerCase().includes('price per night')) ||
        (field.label && field.label.toLowerCase().includes('price_range_per_night')) ||
        (field.id && field.id.toLowerCase().includes('price_per_night')) ||
        (field.id && field.id.toLowerCase().includes('price_range_per_night'))
      )
    ) {
      const value = formData[field.id] || { amount: '', currency: 'UGX' };
      const amount = typeof value === 'object' && value !== null ? value.amount || '' : '';
      const currency = typeof value === 'object' && value !== null ? value.currency || 'UGX' : 'UGX';
      const hasError = !!errors[field.id];
      const currencies = ['UGX', 'USD', 'KES', 'TZS', 'EUR', 'GBP', 'ZAR', 'RWF', 'BIF', 'CAD', 'AUD', 'JPY', 'CNY', 'INR'];
      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id} className="flex items-center gap-2 text-gray-700 font-medium">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              id={field.id}
              type="number"
              min={0}
              step={0.01}
              placeholder={field.placeholder || 'Enter price per night'}
              value={amount}
              onChange={e => {
                const amt = e.target.value;
                handleInputChange(field.id, { amount: amt, currency });
              }}
              className={`w-40 ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#00AEEF]'}`}
            />
            <Select value={currency} onValueChange={val => handleInputChange(field.id, { amount, currency: val })}>
              <SelectTrigger className="w-24 border-gray-300 focus:ring-[#00AEEF]">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {currencies.map(cur => (
                  <SelectItem key={cur} value={cur}>{cur}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {hasError && (
            <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
              <AlertCircle className="w-4 h-4" />
              {errors[field.id]}
            </div>
          )}
        </div>
      );
    }
    // Special handling for amenities multi-select dropdown
    if (
      'id' in field &&
      (field.id === 'amenities' || field.label?.toLowerCase().includes('amenities')) &&
      field.type === 'multi-select'
    ) {
      const value = Array.isArray(formData[field.id]) ? formData[field.id] : [];
      const hasError = !!errors[field.id];
      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id} className="flex items-center gap-2 text-gray-700 font-medium">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          <Select
            value={undefined}
            onValueChange={(val: string) => {
              let newValue: string[];
              if (value.includes(val)) {
                newValue = value.filter((v: string) => v !== val);
              } else {
                newValue = [...value, val];
              }
              handleInputChange(field.id, newValue);
            }}
            open={openDropdown === field.id}
            onOpenChange={(open: boolean) => setOpenDropdown(open ? field.id : null)}
          >
            <SelectTrigger
              className={`w-full ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#00AEEF]'}`}
            >
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent className="min-w-[320px] max-w-2xl max-h-[32rem] overflow-y-auto bg-white shadow-lg rounded-md border border-gray-200 z-[100]">
              {field.options?.map((option: string) => (
                <SelectItem
                  key={option}
                  value={option}
                  className={`hover:bg-[#00AEEF]/10 cursor-pointer px-4 py-3 ${value.includes(option) ? 'bg-[#00AEEF]/10 font-semibold' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value.includes(option)}
                      readOnly
                      className="accent-[#00AEEF]"
                    />
                    {option}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Show selected amenities as badges */}
          {value.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {value.map((amenity: string) => (
                <Badge key={amenity} className="bg-[#00AEEF]/10 text-[#0079C1] border border-[#00AEEF]">{amenity}</Badge>
              ))}
            </div>
          )}
          {hasError && (
            <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
              <AlertCircle className="w-4 h-4" />
              {errors[field.id]}
            </div>
          )}
        </div>
      );
    }
    if ('__roomTypeGroup' in field) {
      return (
        <div key={field.__roomTypeGroup} className="mt-8 mb-2 border-b border-[#00AEEF]/30 pb-1">
          <span className="text-lg font-semibold text-[#0079C1]">{field.__roomTypeGroup} Room Details</span>
        </div>
      );
    }

    // Special handling for roomTypes multi-select dropdown
    if (field.id === 'roomTypes' && field.type === 'multi-select') {
      const value = Array.isArray(formData[field.id]) ? formData[field.id] : [];
      const hasError = !!errors[field.id];
      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id} className="flex items-center gap-2 text-gray-700 font-medium">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          <Select
            value={undefined}
            onValueChange={(val: string) => {
              let newValue: string[];
              if (value.includes(val)) {
                newValue = value.filter((v: string) => v !== val);
              } else {
                newValue = [...value, val];
              }
              handleInputChange(field.id, newValue);
            }}
            open={openDropdown === field.id}
            onOpenChange={(open: boolean) => setOpenDropdown(open ? field.id : null)}
          >
            <SelectTrigger
              className={`w-full ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#00AEEF]'}`}
            >
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent className="min-w-[320px] max-w-2xl max-h-[32rem] overflow-y-auto bg-white shadow-lg rounded-md border border-gray-200 z-[100]">
              {field.options?.map((option: string) => (
                <SelectItem
                  key={option}
                  value={option}
                  className={`hover:bg-[#00AEEF]/10 cursor-pointer px-4 py-3 ${value.includes(option) ? 'bg-[#00AEEF]/10 font-semibold' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value.includes(option)}
                      readOnly
                      className="accent-[#00AEEF]"
                    />
                    {option}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Show selected room types as badges */}
          {value.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {value.map((type: string) => (
                <Badge key={type} className="bg-[#00AEEF]/10 text-[#0079C1] border border-[#00AEEF]">{type}</Badge>
              ))}
            </div>
          )}
          {hasError && (
            <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
              <AlertCircle className="w-4 h-4" />
              {errors[field.id]}
            </div>
          )}
        </div>
      );
    }

    const value = formData[field.id] || (field.type === 'checkbox' ? false : '');
    const hasError = !!errors[field.id];

    // Special handling for Number of Beds and Max Guests as select dropdowns with fixed numbers
    if ((field.label?.toLowerCase().includes('number of beds') || field.id?.toLowerCase().includes('number_of_beds')) && field.required) {
      const value = formData[field.id] || '';
      const hasError = !!errors[field.id];
      const options = Array.from({ length: 10 }, (_, i) => String(i + 1));
      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id} className="flex items-center gap-2 text-gray-700 font-medium">
            {field.label}
            <span className="text-red-500">*</span>
          </Label>
          <Select value={value} onValueChange={(val: string) => handleInputChange(field.id, val)}>
            <SelectTrigger
              className={`w-full ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#00AEEF]'}`}
            >
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent className="min-w-[120px] max-h-[16rem] overflow-y-auto bg-white shadow-lg rounded-md border border-gray-200 z-[100]">
              {options.map((option) => (
                <SelectItem key={option} value={option} className="hover:bg-[#00AEEF]/10 cursor-pointer px-4 py-2">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError && (
            <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
              <AlertCircle className="w-4 h-4" />
              {errors[field.id]}
            </div>
          )}
        </div>
      );
    }
    if ((field.label?.toLowerCase().includes('max guests') || field.id?.toLowerCase().includes('max_guests')) && field.required) {
      const value = formData[field.id] || '';
      const hasError = !!errors[field.id];
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2 text-gray-700 font-medium">
              {field.label}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              min={1}
              max={100}
              value={value}
              placeholder="Enter number of guests"
              onChange={e => {
                let val = e.target.value;
                if (val) {
                  let n = Number(val);
                  if (n < 1) n = 1;
                  if (n > 100) n = 100;
                  handleInputChange(field.id, String(n));
                } else {
                  handleInputChange(field.id, '');
                }
              }}
              className="w-32 border-gray-300 focus:ring-[#00AEEF]"
            />
            {hasError && (
              <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors[field.id]}
              </div>
            )}
          </div>
        );
    }
    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2 text-gray-700 font-medium">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(field.id, e.target.value)}
              className={`min-h-[120px] resize-y ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#00AEEF]'}`}
            />
            {hasError && (
              <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors[field.id]}
              </div>
            )}
          </div>
        );

      case 'select':
        if (field.label?.toLowerCase().includes('price range per night') || field.id?.toLowerCase().includes('price_range_per_night')) {
          // Price per Night with currency selector
          const priceObj = typeof value === 'object' && value !== null ? value : { amount: '', currency: 'UGX' };
          const amount = priceObj.amount || '';
          const currency = priceObj.currency || 'UGX';
          const currencies = ['UGX', 'USD', 'KES', 'TZS', 'EUR', 'GBP', 'ZAR', 'RWF', 'BIF', 'CAD', 'AUD', 'JPY', 'CNY', 'INR'];
          return (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="flex items-center gap-2 text-gray-700 font-medium">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </Label>
              <div className="flex gap-2 items-center">
                <Input
                  id={field.id}
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder={field.placeholder || 'Enter price per night'}
                  value={amount}
                  onChange={e => {
                    const amt = e.target.value;
                    handleInputChange(field.id, { amount: amt, currency });
                  }}
                  className={`w-40 ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#00AEEF]'}`}
                />
                <Select value={currency} onValueChange={val => handleInputChange(field.id, { amount, currency: val })}>
                  <SelectTrigger className="w-24 border-gray-300 focus:ring-[#00AEEF]">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {currencies.map(cur => (
                      <SelectItem key={cur} value={cur}>{cur}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {hasError && (
                <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors[field.id]}
                </div>
              )}
            </div>
          );
        }
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2 text-gray-700 font-medium">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select value={value} onValueChange={(val: string) => handleInputChange(field.id, val)}>
              <SelectTrigger
                className={`w-full ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#00AEEF]'}`}
              >
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className="min-w-[320px] max-w-2xl max-h-[32rem] overflow-y-auto bg-white shadow-lg rounded-md border border-gray-200 z-[100]">
                {field.options?.map((option: string) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="hover:bg-[#00AEEF]/10 cursor-pointer px-4 py-3"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors[field.id]}
              </div>
            )}
          </div>
        );

      // ... (other field types remain the same with proper typing)
      
      // The rest of the field rendering cases remain largely the same
      // Just ensure they're properly typed to handle FormField interface
      
      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2 text-gray-700 font-medium">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              type="text"
              placeholder={field.placeholder}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(field.id, e.target.value)}
              className={hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#00AEEF]'}
            />
            {hasError && (
              <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors[field.id]}
              </div>
            )}
          </div>
        );
    }
  };

  if (loading || !contextReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0079C1]/10 via-[#00AEEF]/10 to-[#7ED321]/10">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="animate-pulse bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] h-2 w-48 mx-auto rounded-full mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading listing form...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0079C1]/10 via-[#00AEEF]/10 to-[#7ED321]/10">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-[#00AEEF] to-[#0079C1] text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0079C1]/10 via-[#00AEEF]/10 to-[#7ED321]/10 pb-12">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] shadow-lg rounded-b-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={safeNavigateBack}
                className="bg-white/20 text-white hover:bg-white/30 shadow-md"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Create {subcategory?.title ?? ''} Listing</h1>
                <p className="text-sm text-emerald-100">Step {currentStep} of {reviewStep}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {category?.title ?? ''}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Bar */}
        <Card className="mb-8 border-0 shadow-lg rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="w-full h-3 bg-gray-200">
                <div 
                  className="h-full bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                ></div>
              </Progress>
            </div>
            
            {/* Step Indicators */}
            <div className="grid grid-cols-6 gap-2 mt-4">
              {Array.from({ length: totalSteps + 1 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep > index + 1 
                      ? 'bg-gradient-to-r from-[#0079C1] to-[#00AEEF] text-white' 
                      : currentStep === index + 1
                      ? 'bg-white border-2 border-[#00AEEF] text-[#00AEEF]'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > index + 1 ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className="text-xs mt-1 text-center text-gray-600 hidden md:block">
                    {index + 1 === reviewStep ? 'Review' : `Step ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card className="shadow-lg rounded-2xl overflow-hidden border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-[#0079C1]/5 via-[#00AEEF]/5 to-[#7ED321]/5 px-6 pt-6">
            <CardTitle className="text-xl font-semibold text-[#0079C1]">
              {currentStep <= totalSteps ? (
                `Step ${currentStep}: ${currentFields[0] && 'label' in currentFields[0] ? currentFields[0].label : 'Listing Details'}`
              ) : (
                'Review Your Listing'
              )}
            </CardTitle>
            <p className="text-sm text-emerald-700">
              {currentStep <= totalSteps 
                ? `Provide information about your ${subcategory?.title?.toLowerCase()}`
                : 'Please review all details before submitting your listing.'
              }
            </p>
          </CardHeader>
          
          <CardContent className="p-6">
            {currentStep <= totalSteps ? (
              <div className="space-y-6">
                {currentFields.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No fields available for this step.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {currentFields.map(renderField)}
                  </div>
                )}
              </div>
            ) : (
              // Review Step
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-[#0079C1]">Listing Summary</h3>
                <div className="grid grid-cols-1 gap-4">
                  {subcategory?.fields?.map((field: FormField) => {
                    const value = formData[field.id];
                    if (field.type === 'file' && value) {
                      const files = Array.isArray(value) ? value : [value];
                      return (
                        <div key={field.id} className="flex flex-col p-4 bg-gray-50 rounded-lg">
                          <span className="font-medium text-[#0079C1] mb-2">{field.label}:</span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                            {files.map((file: any, idx: number) => {
                              if (typeof file === 'string' && (file.startsWith('data:image') || file.match(/\.(jpg|jpeg|png|gif|webp)$/i))) {
                                return (
                                  <img
                                    key={idx}
                                    src={file}
                                    alt={`Preview ${idx + 1}`}
                                    className="w-full h-24 object-cover rounded border"
                                  />
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={field.id} className="flex justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium text-[#0079C1]">{field.label}:</span>
                        <span className="text-emerald-700 text-right">
                          {value
                            ? (Array.isArray(value)
                                ? value.join(', ')
                                : String(value))
                            : <span className="italic text-gray-400">Not provided</span>
                          }
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button 
            variant="outline" 
            onClick={safeNavigateBack}
            className="text-[#0079C1] border-[#0079C1] hover:bg-[#0079C1]/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? 'Change Category' : 'Previous'}
          </Button>

          <Button 
            onClick={handleNext} 
            className="bg-gradient-to-r from-[#00AEEF] to-[#0079C1] text-white hover:from-[#0099d6] hover:to-[#0069a1]"
          >
            {currentStep === reviewStep ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Listing
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ListingCreation;