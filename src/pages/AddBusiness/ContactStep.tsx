import React, { useEffect, useState } from 'react';
import countries from '../../data/countries.json';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '../../components/ui/select';
// AddressItem type for address selects
interface AddressItem {
  id: string;
  name: string;
  parentId?: string;
}
import { apiService } from '../../services/apiService';
import type { Contact } from '../../types/types';

interface ContactStepProps {
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
  errors: { [key: string]: string };
  disabled?: boolean;
}

const emptyContact: Contact = {
  name: '',
  email: '',
  phone: '',
  alternatePhone: '',
  position: '',
  physicalAddress: '',
  isPrimary: false,
  parish: '',
  parishId: '',
  subCounty: '',
  subCountyId: '',
  county: '',
  countyId: '',
  district: '',
  districtId: '',
  region: '',
  regionId: '',
};

const ContactStep: React.FC<ContactStepProps> = ({ contacts, onChange, disabled }) => {
  // Ensure at least one contact is present on mount and when contacts is empty
  useEffect(() => {
    if (!contacts || contacts.length === 0) {
      onChange([{ ...emptyContact }]);
    }
  }, [contacts, onChange]);

  // Track touched state for each contact field
  const [touched, setTouched] = useState<{ [contactIdx: number]: { [field: string]: boolean } }>({});

  const markTouched = (idx: number, field: string) => {
    setTouched(prev => ({
      ...prev,
      [idx]: { ...prev[idx], [field]: true }
    }));
  };
  const [addressData, setAddressData] = useState({
    regions: [] as AddressItem[],
    districts: [] as AddressItem[],
    counties: [] as AddressItem[],
    subCounties: [] as AddressItem[],
    parishes: [] as AddressItem[],
  });
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [searchTerms, setSearchTerms] = useState<string[]>(contacts.map(c => c.parish || ''));
  const [showParishDropdown, setShowParishDropdown] = useState<boolean[]>(contacts.map(() => false));

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
        setAddressData({
          regions: response.regions.map(region => ({ id: String(region.id), name: String(region.description) })),
          districts: response.districts.map(district => ({ id: String(district.id), name: String(district.district_name), parentId: district.parentId ? String(district.parentId) : undefined })),
          counties: response.counties.map(county => ({ id: String(county.id), name: String(county.county_name), parentId: county.parentId ? String(county.parentId) : undefined })),
          subCounties: response.subCounties.map(subCounty => ({ id: String(subCounty.id), name: String(subCounty.sub_county_name), parentId: subCounty.parentId ? String(subCounty.parentId) : undefined })),
          parishes: response.parishes.map(parish => ({ id: String(parish.id), name: String(parish.parish_name), parentId: parish.parentId ? String(parish.parentId) : undefined })),
        });
      } catch (error: any) {
        setError(error.message || 'Failed to load address data');
      } finally {
        setLoading(false);
      }
    };
    fetchAddressHierarchy();
  }, []);

  // Sync searchTerms and showParishDropdown with contacts length
  useEffect(() => {
    setSearchTerms(contacts.map(c => c.parish || ''));
    setShowParishDropdown(contacts.map(() => false));
  }, [contacts.length]);

  const handleContactChange = (idx: number, field: keyof Contact, value: any) => {
    const updated: Contact[] = [...contacts];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange(updated);
  };


  // Parish input change handler (search and free text)
  const handleParishInputChange = (idx: number, value: string) => {
    const updatedSearchTerms = [...searchTerms];
    updatedSearchTerms[idx] = value;
    setSearchTerms(updatedSearchTerms);

    const matchingParish = addressData.parishes.find(p => p.name.toLowerCase() === value.toLowerCase());
    const updated = [...contacts];
    if (matchingParish) {
      // Auto-fill all address fields, coercing to string
      const selectedParish = matchingParish;
      const subCounty = addressData.subCounties.find(sc => sc.id === selectedParish.parentId);
      const county = subCounty ? addressData.counties.find(c => c.id === subCounty.parentId) : null;
      const district = county ? addressData.districts.find(d => d.id === county.parentId) : null;
      const region = district ? addressData.regions.find(r => r.id === district.parentId) : null;
      updated[idx] = {
        ...updated[idx],
        parishId: String(selectedParish.id),
        parish: String(selectedParish.name),
        subCountyId: subCounty ? String(subCounty.id) : '',
        subCounty: subCounty ? String(subCounty.name) : '',
        countyId: county ? String(county.id) : '',
        county: county ? String(county.name) : '',
        districtId: district ? String(district.id) : '',
        district: district ? String(district.name) : '',
        regionId: region ? String(region.id) : '',
        region: region ? String(region.name) : '',
      };
    } else {
      // Free text, clear dependent fields
      updated[idx] = {
        ...updated[idx],
        parish: value,
        parishId: '',
        subCountyId: '',
        subCounty: '',
        countyId: '',
        county: '',
        districtId: '',
        district: '',
        regionId: '',
        region: '',
      };
    }
    onChange(updated);
  };

  const handleParishSelection = (idx: number, parishId: string, parishName: string) => {
    const selectedParish = addressData.parishes.find(p => p.id === parishId);
    const subCounty = selectedParish ? addressData.subCounties.find(sc => sc.id === selectedParish.parentId) : null;
    const county = subCounty ? addressData.counties.find(c => c.id === subCounty.parentId) : null;
    const district = county ? addressData.districts.find(d => d.id === county.parentId) : null;
    const region = district ? addressData.regions.find(r => r.id === district.parentId) : null;
    const updated = [...contacts];
    updated[idx] = {
      ...updated[idx],
      parishId: String(parishId),
      parish: String(parishName),
      subCountyId: subCounty ? String(subCounty.id) : '',
      subCounty: subCounty ? String(subCounty.name) : '',
      countyId: county ? String(county.id) : '',
      county: county ? String(county.name) : '',
      districtId: district ? String(district.id) : '',
      district: district ? String(district.name) : '',
      regionId: region ? String(region.id) : '',
      region: region ? String(region.name) : '',
    };
    onChange(updated);
    // Hide dropdown
    const updatedShow = [...showParishDropdown];
    updatedShow[idx] = false;
    setShowParishDropdown(updatedShow);
    // Update search term
    const updatedSearchTerms = [...searchTerms];
    updatedSearchTerms[idx] = parishName;
    setSearchTerms(updatedSearchTerms);
  };

  const removeContact = (idx: number) => {
    const updated = contacts.filter((_, i) => i !== idx);
    onChange(updated);
  };
  const addContact = () => {
    onChange([...contacts, { ...emptyContact }]);
  };
  // Country picker state for all contacts (main phone)
  const [selectedCountries, setSelectedCountries] = useState(() =>
    contacts.map(() => countries.find((c) => c.code === 'UG') || countries[0])
  );
  // Country picker state for all contacts (alternate phone)
  const [selectedAltCountries, setSelectedAltCountries] = useState(() =>
    contacts.map(() => countries.find((c) => c.code === 'UG') || countries[0])
  );
  useEffect(() => {
    setSelectedCountries((prev) => {
      if (contacts.length > prev.length) {
        return [
          ...prev,
          ...Array(contacts.length - prev.length).fill(countries.find((c) => c.code === 'UG') || countries[0])
        ];
      } else if (contacts.length < prev.length) {
        return prev.slice(0, contacts.length);
      }
      return prev;
    });
    setSelectedAltCountries((prev) => {
      if (contacts.length > prev.length) {
        return [
          ...prev,
          ...Array(contacts.length - prev.length).fill(countries.find((c) => c.code === 'UG') || countries[0])
        ];
      } else if (contacts.length < prev.length) {
        return prev.slice(0, contacts.length);
      }
      return prev;
    });
  }, [contacts.length]);

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Business Contacts</h2>
      <div className="space-y-6">
        {contacts.map((contact, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 border-b pb-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Name *</label>
              <input
                name="name"
                value={contact.name}
                onChange={e => handleContactChange(idx, 'name', e.target.value)}
                onBlur={() => markTouched(idx, 'name')}
                placeholder="Name"
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${(!contact.name && touched[idx]?.name) ? 'border-red-500' : 'border-gray-300'}`}
                required
                disabled={disabled}
              />
              {(!contact.name && touched[idx]?.name) && (
                <p className="text-red-500 text-sm mt-1">Name is required</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Position</label>
              <input
                name="position"
                value={contact.position || ''}
                onChange={e => handleContactChange(idx, 'position', e.target.value)}
                placeholder="Position (e.g. Manager)"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={disabled}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email *</label>
              <input
                name="email"
                value={contact.email}
                onChange={e => handleContactChange(idx, 'email', e.target.value)}
                onBlur={() => markTouched(idx, 'email')}
                placeholder="Email"
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${(!contact.email && touched[idx]?.email) ? 'border-red-500' : 'border-gray-300'}`}
                required
                disabled={disabled}
              />
              {(!contact.email && touched[idx]?.email) && (
                <p className="text-red-500 text-sm mt-1">Email is required</p>
              )}
              {/* Strict: show error if invalid email format */}
              {contact.email && touched[idx]?.email && !/^\S+@\S+\.\S+$/.test(contact.email) && (
                <p className="text-red-500 text-sm mt-1">Enter a valid email address</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Phone *</label>
              <div className="flex gap-2">
                {/* Country Selector */}
                <div className="w-1/3">
                  <Select
                    value={selectedCountries[idx]?.code}
                    onValueChange={(code) => {
                      const country = countries.find((c) => c.code === code);
                      if (country) {
                        setSelectedCountries((prev) => {
                          const updated = [...prev];
                          updated[idx] = country;
                          return updated;
                        });
                        // Replace dial code in phone if present
                        const oldNumber = contact.phone?.replace(/^\+?\d+/, '') || '';
                        handleContactChange(idx, 'phone', `${country.dialling_code}${oldNumber}`);
                      }
                    }}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue asChild>
                        <span className="flex items-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                          {selectedCountries[idx]?.flag ? (
                            <img
                              src={selectedCountries[idx].flag}
                              alt={selectedCountries[idx].code + ' flag'}
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
                            <span style={{ marginRight: 4 }}>{selectedCountries[idx]?.code}</span>
                          )}
                          <span className="ml-1 font-medium">{selectedCountries[idx]?.name} ({selectedCountries[idx]?.dialling_code})</span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white shadow-lg">
                      {countries.map((c) => (
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
                {/* Phone Input */}
                {/* Main Phone Input with fixed country code */}
                <div className="flex-1 flex items-center">
                  <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-700 rounded-l-md select-none text-sm font-medium">
                    {selectedCountries[idx]?.dialling_code}
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="7\\d{8}"
                    maxLength={9}
                    value={(contact.phone || '').replace(selectedCountries[idx]?.dialling_code, '')}
                    onChange={e => {
                      let raw = e.target.value;
                      // Only allow digits, must start with 7, max 9 digits
                      let cleaned = raw.replace(/[^\d]/g, '').slice(0, 9);
                      if (cleaned && (!/^7\d{0,8}$/.test(cleaned))) return; // Only allow numbers starting with 7
                      handleContactChange(idx, 'phone', (selectedCountries[idx]?.dialling_code || '') + cleaned);
                    }}
                    onBlur={() => markTouched(idx, 'phone')}
                    placeholder={`e.g., 700000000`}
                    className={`w-full p-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      (!contact.phone && touched[idx]?.phone) ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ borderLeft: 'none' }}
                    required
                    disabled={disabled}
                  />
                </div>
              </div>
              {(!contact.phone && touched[idx]?.phone) && (
                <p className="text-red-500 text-sm mt-1">Phone is required</p>
              )}
              {/* Strict: show error if invalid phone format */}
              {contact.phone && touched[idx]?.phone && !/^\+?\d*7\d{8}$/.test(contact.phone) && (
                <p className="text-red-500 text-sm mt-1">Phone number must be 9 digits, start with 7 (e.g. 700000000)</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Alternate Phone</label>
              <div className="flex gap-2">
                {/* Country Selector for Alternate Phone */}
                <div className="w-1/3">
                  <Select
                    value={selectedAltCountries[idx]?.code}
                    onValueChange={(code) => {
                      const country = countries.find((c) => c.code === code);
                      if (country) {
                        setSelectedAltCountries((prev) => {
                          const updated = [...prev];
                          updated[idx] = country;
                          return updated;
                        });
                        // Replace dial code in alternate phone if present
                        const oldNumber = contact.alternatePhone?.replace(/^\+?\d+/, '') || '';
                        handleContactChange(idx, 'alternatePhone', `${country.dialling_code}${oldNumber}`);
                      }
                    }}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue asChild>
                        <span className="flex items-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                          {selectedAltCountries[idx]?.flag ? (
                            <img
                              src={selectedAltCountries[idx].flag}
                              alt={selectedAltCountries[idx].code + ' flag'}
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
                            <span style={{ marginRight: 4 }}>{selectedAltCountries[idx]?.code}</span>
                          )}
                          <span className="ml-1 font-medium">{selectedAltCountries[idx]?.name} ({selectedAltCountries[idx]?.dialling_code})</span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white shadow-lg">
                      {countries.map((c) => (
                        <SelectItem key={`${c.code}-${c.dialling_code}-alt`} value={c.code}>
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
                {/* Alternate Phone Input with fixed country code */}
                <div className="flex-1 flex items-center">
                  <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-700 rounded-l-md select-none text-sm font-medium">
                    {selectedAltCountries[idx]?.dialling_code}
                  </span>
                  <input
                    name="alternatePhone"
                    type="tel"
                    inputMode="numeric"
                    pattern="7\\d{8}"
                    maxLength={9}
                    value={(contact.alternatePhone || '').replace(selectedAltCountries[idx]?.dialling_code, '')}
                    onChange={e => {
                      let raw = e.target.value;
                      // Only allow digits, must start with 7, max 9 digits
                      let cleaned = raw.replace(/[^\d]/g, '').slice(0, 9);
                      if (cleaned && (!/^7\d{0,8}$/.test(cleaned))) return; // Only allow numbers starting with 7
                      handleContactChange(idx, 'alternatePhone', (selectedAltCountries[idx]?.dialling_code || '') + cleaned);
                    }}
                    onBlur={() => markTouched(idx, 'alternatePhone')}
                    placeholder={`e.g., 700000000`}
                    className={`w-full p-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                    style={{ borderLeft: 'none' }}
                    disabled={disabled}
                  />
              {/* Strict: show error if invalid alternate phone format */}
              {contact.alternatePhone && touched[idx]?.alternatePhone && !/^\+?\d*7\d{8}$/.test(contact.alternatePhone) && (
                <p className="text-red-500 text-sm mt-1">Alternate phone must be 9 digits, start with 7 (e.g. 700000000)</p>
              )}
                </div>
              </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="mb-4 md:col-span-2 relative">
                <label className="block text-gray-700 mb-2">Parish *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerms[idx] || ''}
                    onChange={e => handleParishInputChange(idx, e.target.value)}
                    onFocus={() => {
                      const updatedShow = [...showParishDropdown];
                      updatedShow[idx] = true;
                      setShowParishDropdown(updatedShow);
                    }}
                    onBlur={() => setTimeout(() => {
                      const updatedShow = [...showParishDropdown];
                      updatedShow[idx] = false;
                      setShowParishDropdown(updatedShow);
                    }, 200)}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${(!contact.parish && contacts.length > 0) ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Type parish name or select from list"
                    disabled={disabled}
                  />
                  {(!contact.parish && contacts.length > 0) && (
                    <p className="text-red-500 text-sm mt-1">Parish is required</p>
                  )}
                  {showParishDropdown[idx] && addressData.parishes.filter(parish => parish.name.toLowerCase().includes((searchTerms[idx] || '').toLowerCase())).length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {addressData.parishes.filter(parish => parish.name.toLowerCase().includes((searchTerms[idx] || '').toLowerCase())).map(parish => (
                        <div
                          key={parish.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onMouseDown={() => handleParishSelection(idx, parish.id, parish.name)}
                        >
                          {parish.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Sub-County *</label>
                <input type="text" value={contact.subCounty} disabled className={`w-full p-3 border rounded-md bg-gray-100 ${(!contact.subCounty && touched[idx]?.subCounty) ? 'border-red-500' : 'border-gray-300'}`} onBlur={() => markTouched(idx, 'subCounty')} />
                {(!contact.subCounty && touched[idx]?.subCounty) && (
                  <p className="text-red-500 text-sm mt-1">Sub-county is required</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">County *</label>
                <input type="text" value={contact.county} disabled className={`w-full p-3 border rounded-md bg-gray-100 ${(!contact.county && touched[idx]?.county) ? 'border-red-500' : 'border-gray-300'}`} onBlur={() => markTouched(idx, 'county')} />
                {(!contact.county && touched[idx]?.county) && (
                  <p className="text-red-500 text-sm mt-1">County is required</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">District *</label>
                <input type="text" value={contact.district} disabled className={`w-full p-3 border rounded-md bg-gray-100 ${(!contact.district && touched[idx]?.district) ? 'border-red-500' : 'border-gray-300'}`} onBlur={() => markTouched(idx, 'district')} />
                {(!contact.district && touched[idx]?.district) && (
                  <p className="text-red-500 text-sm mt-1">District is required</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Region *</label>
                <input type="text" value={contact.region} disabled className={`w-full p-3 border rounded-md bg-gray-100 ${(!contact.region && touched[idx]?.region) ? 'border-red-500' : 'border-gray-300'}`} onBlur={() => markTouched(idx, 'region')} />
                {(!contact.region && touched[idx]?.region) && (
                  <p className="text-red-500 text-sm mt-1">Region is required</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Physical Address</label>
                <input name="physicalAddress" value={contact.physicalAddress} onChange={e => handleContactChange(idx, 'physicalAddress', e.target.value)} placeholder="Physical Address" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" disabled={disabled} />
              </div>
            </div>
            <div className="flex items-center">
              <input type="checkbox" checked={!!contact.isPrimary} onChange={e => handleContactChange(idx, 'isPrimary', e.target.checked)} disabled={disabled} />
              <span className="ml-2">Primary</span>
            </div>
            <button type="button" className="text-red-500" onClick={() => removeContact(idx)} disabled={disabled}>Remove</button>
          </div>
        ))}
        <button type="button" className="ml-auto flex items-center px-6 py-2 rounded-lg text-white bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 disabled:opacity-70 transition-colors" onClick={addContact} disabled={disabled}>
          Add Contact
        </button>
      </div>
    </section>
  );
};

export default ContactStep;
