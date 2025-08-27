import { ReactNode } from "react";

export type Business = {
  trading_name: ReactNode;
  ownership_type: ReactNode;
  website_url: ReactNode;
  email_address: ReactNode;
  registration_date: ReactNode;
  registration_authority: ReactNode;
  images: any;
  bank_info: any;
  contacts: any;
  attachments: any;
  addresses: any;
  legal_name: string;
  display_name: string;
  id: number;
  name: string;
  description: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  business_type_id?: number;
  business_type_name?: string;
  contact_email?: string;
  contact_phone?: string;
  owner_name?: string;
  owner_email?: string;
};

export type BusinessModule = {
  id: number;
  name: string;
  description: string;
};

export type BusinessType = {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
};

export type Region = {
  id: number;
  name: string;
};

export type District = {
  id: number;
  name: string;
  region_id: number;
};

export type County = {
  id: number;
  name: string;
  district_id: number;
};

export type SubCounty = {
  id: number;
  name: string;
  county_id: number;
};

export type Parish = {
  id: number;
  name: string;
  sub_county_id: number;
};

export type StaffMember = {
  id?: number;
  name: string;
  email: string;
  position: string;
  contact_phone_1: string;
  contact_phone_2: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
};

export type Address = {
  id?: number;
  business_id?: number;
  address_type: string;
  region_id: number;
  region_name?: string;
  district_id: number;
  district_name?: string;
  county_id: number;
  county_name?: string;
  sub_county_id: number;
  sub_county_name?: string;
  parish_id: number;
  parish_name?: string;
  village: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
};

export type BankInformation = {
  id?: number;
  business_id?: number;
  bank_name: string;
  bank_branch: string;
  account_name: string;
  account_number: string;
  account_type: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
};

export type BusinessImage = {
  image_data: any;
  id?: number;
  business_id?: number;
  image_name?: string;
  is_cover_image?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Amenity = {
  id: number;
  name: string;
  description?: string;
};

export type BusinessAmenity = {
  id?: number;
  business_id: number;
  amenity_id: number;
  amenity_name?: string;
  amenity_description?: string;
  created_at?: string;
};

export type FormData = {
  business_type_id: string;
  name: string;
  description: string;
  contact_phone: string;
  contact_email: string;
  status: string;
  staff: StaffMember[];
  address_type: string;
  region_id: string;
  district_id: string;
  county_id: string;
  sub_county_id: string;
  parish_id: string;
  village: string;
  bank_name: string;
  bank_branch: string;
  account_name: string;
  account_number: string;
  account_type: string;
  images: File[];
  cover_image_index: number;
  amenities?: number[];
};

// Utility type for generic API responses
export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  returnObject?: T;
  [key: string]: any;
};

// Business Registration Types
export type BankAccount = {
  accountType: string | number | readonly string[] | undefined;
  id?: string;
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  branch: string;
  isPrimary: boolean;
};

export type Contact = {
  position: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  physicalAddress: string;
  isPrimary: boolean;
  parish: string;
  parishId: string;
  subCounty: string;
  subCountyId: string;
  county: string;
  countyId: string;
  district: string;
  districtId: string;
  region: string;
  regionId: string;
  // removed village and country
  parishSearch?: string;
  parishSearchResults?: any[];
};

export type BusinessRegistrationForm = {
  amenities?: string[];
  village?: string;
  staff?: any[];
  // 1. Basic Information
  legalName: string;
  tradingName: string;
  parentInstitutionName?: string;
  tin?: string;
  registrationDate?: string;
  websiteUrl?: string;
  registrationType?: string;
  parentInstitution?: string;
  parentInstitutionId?: string;
  branchType?: string;
  businessName?: string;
  contactPhone?: string;
  emailAddress?: string;
  districtOrCity?: string;
  registrationAuthority?: string;
  registrationBody?: string;
  industrySector?: string;
  industrySubSector?: string;
  subSectorType?: string;
  subSectorScale?: string;
  // 2. Business Classification
  businessType: string;
  businessSubType?: string;
  industryType?: string;
  subCategory?: string;
  industrySubType?: string;
  businessCategory?: string;
  sector?: string;
  subSector?: string;
  industryCategory?: string;
  operationalModel?: string;
  // 3. Banking Information
  bankAccounts: BankAccount[];
  // 4. Contact Information
  contacts: Contact[];
  // 5. Location Information
  country?: string;
  parish?: string;
  parishId?: string;
  // country and physicalAddress already defined above, remove duplicates
  parishName?: string;
  subCounty?: string;
  subCountyId?: string;
  subCountyName?: string;
  county?: string;
  countyId?: string;
  countyName?: string;
  district?: string;
  districtId?: string;
  districtName?: string;
  region?: string;
  regionId?: string;
  regionName?: string;
  physicalAddress?: string;
  // 6. Review & Submit
  agreeTo?: boolean;
  businessNameCert?: any;
  tradeLicense?: any;
  taxCert?: any;
  passportPhoto?: any;
  ninId?: any;
};