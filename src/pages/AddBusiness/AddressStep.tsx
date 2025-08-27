import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';
import { BusinessRegistrationForm } from '../../types/types';

interface AddressItem {
  id: string;
  name: string;
  parentId?: string;
}


interface ControlledAddressStepProps {
  values: Partial<BusinessRegistrationForm>;
  onChange: (fields: Partial<BusinessRegistrationForm>) => void;
  errors: { [key: string]: string };
  disabled?: boolean;
}

const AddressStep: React.FC<ControlledAddressStepProps> = ({ values, onChange, errors = {}, disabled }) => {
  const [addressData, setAddressData] = useState({
    regions: [] as AddressItem[],
    districts: [] as AddressItem[],
    counties: [] as AddressItem[],
    subCounties: [] as AddressItem[],
    parishes: [] as AddressItem[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(values.parishName || '');

  useEffect(() => {
    if (values.parishId) {
      const parish = addressData.parishes.find(p => p.id === values.parishId);
      if (parish && searchTerm !== parish.name) {
        setSearchTerm(parish.name);
      }
    } else if (values.parishName !== searchTerm) {
      setSearchTerm(values.parishName || '');
    }
  }, [values.parishId, values.parishName, addressData.parishes]);
  const [showParishDropdown, setShowParishDropdown] = useState(false);

  useEffect(() => {
    const fetchAddressHierarchy = async () => {
      try {
        setLoading(true);
        setError(null);

        const { sendGetToServer } = apiService();
        const response = await sendGetToServer('address/getaddress', { id: undefined }) as {
          regions: any[];
          districts: any[];
          counties: any[];
          subCounties: any[];
          parishes: any[];
        };

        if (!response) {
          throw new Error('Failed to fetch address data');
        }

        setAddressData({
          regions: response.regions.map((region: any) => ({
            id: String(region.id),
            name: String(region.description),
          })),
          districts: response.districts.map((district: any) => ({
            id: String(district.id),
            name: String(district.district_name),
            parentId: district.parentId ? String(district.parentId) : undefined,
          })),
          counties: response.counties.map((county: any) => ({
            id: String(county.id),
            name: String(county.county_name),
            parentId: county.parentId ? String(county.parentId) : undefined,
          })),
          subCounties: response.subCounties.map((subCounty: any) => ({
            id: String(subCounty.id),
            name: String(subCounty.sub_county_name),
            parentId: subCounty.parentId ? String(subCounty.parentId) : undefined,
          })),
          parishes: response.parishes.map((parish: any) => ({
            id: String(parish.id),
            name: String(parish.parish_name),
            parentId: parish.parentId ? String(parish.parentId) : undefined,
          })),
        });
      } catch (error: any) {
        console.error('Error fetching address hierarchy:', error);
        setError(error.message || 'Failed to load address data');
      } finally {
        setLoading(false);
      }
    };

    fetchAddressHierarchy();
  }, []);

  const fillAddressHierarchy = (parishId: string) => {
    const selectedParish = addressData.parishes.find(p => p.id === parishId);
    const subCounty = selectedParish ? addressData.subCounties.find(sc => sc.id === selectedParish.parentId) : null;
    const county = subCounty ? addressData.counties.find(c => c.id === subCounty.parentId) : null;
    const district = county ? addressData.districts.find(d => d.id === county.parentId) : null;
    const region = district ? addressData.regions.find(r => r.id === district.parentId) : null;
    onChange({
      parishId: parishId,
      parishName: selectedParish ? String(selectedParish.name) : '',
      subCountyId: subCounty ? subCounty.id : '',
      subCountyName: subCounty ? String(subCounty.name) : '',
      countyId: county ? county.id : '',
      countyName: county ? String(county.name) : '',
      districtId: district ? district.id : '',
      districtName: district ? String(district.name) : '',
      regionId: region ? region.id : '',
      regionName: region ? String(region.name) : '',
    });
  };

  // Strict validation: Only show errors for required or filled optional fields


  // Filter parishes based on searchTerm (case-insensitive)
  const filteredParishes = addressData.parishes.filter(parish =>
    parish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Address Information</h2>
      {loading && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md text-sm" role="status" aria-live="polite">
          Loading address data...
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Editable Parish input with searchable dropdown */}
        <div className="mb-4 md:col-span-2 relative">
          <label htmlFor="parishInput" className="block text-sm font-medium text-gray-700 mb-1">
            Parish *
          </label>
          <div className="relative">
            <input
              id="parishInput"
              type="text"
              value={searchTerm}
              onChange={e => {
                const value = e.target.value;
                setSearchTerm(value);
                const matchingParish = addressData.parishes.find(p => p.name.toLowerCase() === value.toLowerCase());
                if (matchingParish) {
                  fillAddressHierarchy(matchingParish.id);
                  setSearchTerm(matchingParish.name);
                  setShowParishDropdown(false);
                } else {
                  onChange({
                    parishName: value,
                    parishId: '',
                    subCountyId: '',
                    subCountyName: '',
                    countyId: '',
                    countyName: '',
                    districtId: '',
                    districtName: '',
                    regionId: '',
                    regionName: '',
                  });
                }
              }}
              onFocus={() => setShowParishDropdown(true)}
              onBlur={() => setTimeout(() => setShowParishDropdown(false), 200)}
              className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.parishId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Type parish name or select from list"
              disabled={disabled}
              aria-describedby="parishId-error"
            />
            {showParishDropdown && filteredParishes.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredParishes.map(parish => (
                  <div
                    key={parish.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => {
                      fillAddressHierarchy(parish.id);
                      setSearchTerm(parish.name);
                      setShowParishDropdown(false);
                    }}
                  >
                    {parish.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.parishId && (
            <p className="mt-1 text-sm text-red-600">{errors.parishId}</p>
          )}
        </div>

        {/* Auto-filled fields, disabled for manual selection, now as text inputs */}
        <div className="mb-4">
          <label htmlFor="subCountyName" className="block text-sm font-medium text-gray-700 mb-1">Sub-County *</label>
          <input
            type="text"
            name="subCountyName"
            id="subCountyName"
            className={`w-full p-2.5 border rounded-md bg-gray-100 ${(errors.subCountyId || (!values.subCountyId && Object.keys(errors).length > 0)) ? 'border-red-500' : 'border-gray-300'}`}
            value={values.subCountyName || ''}
            disabled
          />
          {(errors.subCountyId || (!values.subCountyId && Object.keys(errors).length > 0)) && (
            <p className="mt-1 text-sm text-red-600">{errors.subCountyId || 'Sub-county is required'}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="countyName" className="block text-sm font-medium text-gray-700 mb-1">County *</label>
          <input
            type="text"
            name="countyName"
            id="countyName"
            className={`w-full p-2.5 border rounded-md bg-gray-100 ${(errors.countyId || (!values.countyId && Object.keys(errors).length > 0)) ? 'border-red-500' : 'border-gray-300'}`}
            value={values.countyName || ''}
            disabled
          />
          {(errors.countyId || (!values.countyId && Object.keys(errors).length > 0)) && (
            <p className="mt-1 text-sm text-red-600">{errors.countyId || 'County is required'}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="districtName" className="block text-sm font-medium text-gray-700 mb-1">District *</label>
          <input
            type="text"
            name="districtName"
            id="districtName"
            className={`w-full p-2.5 border rounded-md bg-gray-100 ${(errors.districtId || (!values.districtId && Object.keys(errors).length > 0)) ? 'border-red-500' : 'border-gray-300'}`}
            value={values.districtName || ''}
            disabled
          />
          {(errors.districtId || (!values.districtId && Object.keys(errors).length > 0)) && (
            <p className="mt-1 text-sm text-red-600">{errors.districtId || 'District is required'}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="regionName" className="block text-sm font-medium text-gray-700 mb-1">Region *</label>
          <input
            type="text"
            name="regionName"
            id="regionName"
            className={`w-full p-2.5 border rounded-md bg-gray-100 ${(errors.regionId || (!values.regionId && Object.keys(errors).length > 0)) ? 'border-red-500' : 'border-gray-300'}`}
            value={values.regionName || ''}
            disabled
          />
          {(errors.regionId || (!values.regionId && Object.keys(errors).length > 0)) && (
            <p className="mt-1 text-sm text-red-600">{errors.regionId || 'Region is required'}</p>
          )}
        </div>

        <div className="mb-4 md:col-span-2">
          <label htmlFor="physicalAddress" className="block text-sm font-medium text-gray-700 mb-1">Physical Address *</label>
          <input
            type="text"
            name="physicalAddress"
            id="physicalAddress"
            className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${(errors.physicalAddress || (!values.physicalAddress && Object.keys(errors).length > 0)) ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter physical address"
            aria-describedby="physicalAddress-error"
            value={values.physicalAddress || ''}
            onChange={e => {
              onChange({ physicalAddress: e.target.value });
            }}
            disabled={disabled}
          />
          {(errors.physicalAddress || (!values.physicalAddress && Object.keys(errors).length > 0)) && (
            <p className="mt-1 text-sm text-red-600">{errors.physicalAddress || 'Physical address is required'}</p>
          )}
        </div>
      </div>
      {/* No form element, immediate submit on change */}
    </div>
  );
};

export default AddressStep;