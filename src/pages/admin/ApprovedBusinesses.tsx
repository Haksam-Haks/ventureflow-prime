"use client";
import React, { useState, useEffect } from 'react';
import { Check, Download, Loader2, Eye } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from "react-hot-toast";

interface Business {
  business_type: string;
  legal_name: string;
  trading_name: string;
  ownership_type: string;
  display_name: string;
  website_url: any;
  email_address: string;
  registration_date: any;
  registration_authority: string;
  updated_at: any;
  id: string;
  name: string;
  type?: string;
  contact?: string;
  email?: string;
  phone?: string;
  contact_email?: string;
  contact_phone?: string;
  status: 'pending' | 'approved' | 'rejected' | 'deactivated';
  submitted?: string;
  created_at?: string;
  documents?: number;
}



// --- AttachmentPreview helper (from BusinessDetailPage) ---
function getAttachmentImgSrc(val: string) {
  if (!val) return undefined;
  const isBase64 =
    (val.length > 100 && /^[A-Za-z0-9+/=]+$/.test(val)) ||
    val.startsWith('/9j/') ||
    val.startsWith('iVBORw0KGgo') ||
    val.startsWith('R0lGOD');
  if (
    val.startsWith('http') ||
    val.startsWith('/assets/') ||
    val.startsWith('data:')
  ) {
    return val;
  } else if (isBase64) {
    let mime = 'image/jpeg';
    if (val.startsWith('iVBORw0KGgo')) mime = 'image/png';
    else if (val.startsWith('R0lGOD')) mime = 'image/gif';
    return `data:${mime};base64,${val}`;
  } else {
    return `/assets/img/${val}`;
  }
}

interface AttachmentPreviewProps {
  label: string;
  value?: string;
  onClick?: (src: string) => void;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ label, value, onClick }) => {
  const imgSrc = value ? getAttachmentImgSrc(value) : null;
  return (
    <div className="mb-3">
      <h4 className="font-medium text-[#0079C1] mb-2">{label}</h4>
      {imgSrc ? (
        <div className="border border-[#0079C1]/20 rounded-lg overflow-hidden group cursor-pointer" onClick={() => onClick && onClick(imgSrc!)}>
          <img 
            src={imgSrc!} 
            alt={label} 
            className="w-full h-40 object-contain bg-gray-50 transition-transform group-hover:scale-105"
          />
          <div className="bg-[#0079C1]/90 text-white text-center py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            Click to view full size
          </div>
        </div>
      ) : (
        <div className="text-gray-400 italic text-sm">Not provided</div>
      )}
    </div>
  );
};

const ApprovedBusinesses: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalBusiness, setModalBusiness] = useState<any | null>(null);
  const [modalTab, setModalTab] = useState('overview');
  const [, setModalImg] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  const handleDeleteBusiness = async () => {
    if (!modalBusiness) return;
    if (!deleteReason.trim()) {
      toast.error('Please provide a reason for deletion.');
      return;
    }
    try {
      setModalLoading(true);
      const res = await apiService().sendPostToServer<{ success: boolean; message?: string }>('admin/businesses/delete', {
        businessId: modalBusiness.id,
        reason: deleteReason
      });
      if (res?.success) {
        toast.success('Business deleted and user notified');
        setModalOpen(false);
        setDeleteReason('');
        setShowDeletePrompt(false);
        // Optionally refresh the list
        setBusinesses(businesses.filter(b => b.id !== modalBusiness.id));
      } else {
        toast.error(res?.message || 'Failed to delete business');
      }
    } catch (err) {
      toast.error('Failed to delete business');
    } finally {
      setModalLoading(false);
    }
  };
  const handleViewBusiness = async (id: string) => {
    setModalLoading(true);
    setModalOpen(true);
    try {
      const res = await apiService().sendPostToServer<{ returnObject?: Business; data?: Business }>(
        `admin/get/full-info`,
        { businessId: id }
      );
      const b = res?.returnObject || res?.data;
      if (b) setModalBusiness(b as Business);
      else {
        setModalBusiness(null);
        toast.error('Business not found');
      }
    } catch (err) {
      setModalBusiness(null);
      toast.error('Failed to fetch business details');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalBusiness(null);
  };

  const handleActivate = async () => {
    if (!modalBusiness) return;
    try {
      setModalLoading(true);
      const res = await apiService().sendPostToServer<{ success: boolean; message?: string }>('admin/activate', { businessId: modalBusiness.id });
      if (res?.success) {
        toast.success('Business activated');
        setModalBusiness({ ...modalBusiness, status: 'approved' });
      } else {
        toast.error(res?.message || 'Failed to activate');
      }
    } catch (err) {
      toast.error('Failed to activate');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!modalBusiness) return;
    try {
      setModalLoading(true);
      const res = await apiService().sendPostToServer<{ success: boolean; message?: string }>('admin/deactivate', { businessId: modalBusiness.id });
      if (res?.success) {
        toast.success('Business deactivated');
        setModalBusiness({ ...modalBusiness, status: 'pending' });
      } else {
        toast.error(res?.message || 'Failed to deactivate');
      }
    } catch (err) {
      toast.error('Failed to deactivate');
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        // Fetch all businesses, filter approved in frontend
        const response = await apiService().sendPostToServer('admin/businesses', {});
        const businessesData = (response as any)?.data || (response as any)?.returnObject || [];
        if (!Array.isArray(businessesData)) {
          console.warn('Unexpected businesses data format:', businessesData);
          setBusinesses([]);
          return;
        }
        setBusinesses(businessesData);
      } catch (err) {
        console.error('Error fetching businesses:', err);
        toast.error(err instanceof Error ? err.message : 'Failed to load approved businesses');
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  // Only show businesses with status 'approved' and matching search
  const filteredBusinesses = businesses.filter(business => {
    if (business.status !== 'approved' && business.status !== 'deactivated') return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (business.name?.toLowerCase() || '').includes(searchLower) ||
      (business.type?.toLowerCase() || '').includes(searchLower) ||
      (business.contact?.toLowerCase() || '').includes(searchLower) ||
      (business.email?.toLowerCase() || '').includes(searchLower) ||
      (business.phone?.toLowerCase() || '').includes(searchLower)
    );
  });

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await apiService().sendPostToServer('admin/businessExport', {});
      if (!response) {
        throw new Error('No export data received');
      }
      const blob = new Blob(
        [response instanceof Blob ? response : JSON.stringify(response)],
        { type: 'text/csv;charset=utf-8;' }
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `approved_businesses_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      toast.success("Businesses exported successfully");
    } catch (err) {
      console.error('Error exporting businesses:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to export businesses');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  return (
      <div className="flex flex-col gap-6 px-6 md:px-8 py-8 w-full max-w-1xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0079C1]">Approved Businesses</h1>
            <p className="text-sm text-[#0079C1]/80 mt-1">
              View all approved and working businesses
            </p>
          </div>
          <button 
            onClick={handleExport}
            disabled={loading || businesses.length === 0}
            className="inline-flex items-center px-4 py-2 bg-[#00AEEF] text-white rounded-md hover:bg-[#0079C1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export
          </button>
        </div>

        {/* Search Filter */}
        <div className="bg-white/80 p-4 rounded-lg shadow border border-white/30 mt-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-[#0079C1]/60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search businesses by name, type, contact, email or phone..."
              className="pl-10 w-full rounded-md border border-white/30 shadow-sm focus:border-[#00AEEF] focus:ring-[#00AEEF] bg-white/60"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Approved Businesses Table - match BusinessApprovals columns */}
        <div className="bg-white/80 rounded-lg shadow overflow-hidden border border-white/30 mt-2">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-white/30">
              <thead className="bg-white/10">
                <tr>
                  {['ID','Business Type','Legal Name','Trading Name','Ownership Type','Display Name','Website','Contact Phone','Email','RegistrationDate','Authority','Status','Created At','Updated At','Actions'].map(
                    (col) => (
                      <th
                        key={col}
                        scope="col"
                        className="px-2 py-3 text-left text-xs font-medium text-[#0079C1]/80 uppercase tracking-wider truncate"
                        style={{maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white/10 divide-y divide-white/30">
                {loading ? (
                  <tr>
                    <td colSpan={14} className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#0079C1]" />
                      </div>
                      <p className="mt-2 text-sm text-[#0079C1]/80">Loading approved businesses...</p>
                    </td>
                  </tr>
                ) : filteredBusinesses.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="px-6 py-4 text-center text-[#0079C1]/80">
                      {searchTerm ? 'No businesses match your search' : 'No approved businesses found'}
                    </td>
                  </tr>
                ) : (
                  filteredBusinesses.map((business) => (
                    <tr key={business.id} className="hover:bg-white/20">
                      <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.id}</td>
                      <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.business_type || '-'}</td>
                      <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.legal_name || '-'}</td>
                      <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.trading_name || '-'}</td>
                      <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.ownership_type || '-'}</td>
                      <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.display_name || '-'}</td>
                      <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.website_url ? <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="text-[#0079C1] underline">{business.website_url}</a> : '-'}</td>
                      <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.contact_phone || '-'}</td>
                      <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.email_address || '-'}</td>
                      <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.registration_date ? formatDate(business.registration_date) : '-'}</td>
                      <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.registration_authority || '-'}</td>
                      <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.status === 'approved' ? (
                        <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full capitalize bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Approved
                        </span>
                      ) : business.status === 'deactivated' ? (
                        <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full capitalize bg-gray-200 text-gray-700">
                          Deactivated
                        </span>
                      ) : (
                        <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full capitalize bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                      </td>
                      <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.created_at ? formatDate(business.created_at) : '-'}</td>
                      <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.updated_at ? formatDate(business.updated_at) : '-'}</td>
                      <td className="px-2 py-4 text-center">
                        <button
                          className="inline-flex items-center justify-center p-2 rounded hover:bg-[#0079C1]/10 text-[#0079C1]"
                          title="View Details"
                          onClick={() => handleViewBusiness(business.id)}
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Powered by footer */}
        <div className="w-full flex flex-col items-center justify-center py-4 px-2 text-center bg-transparent mt-8" style={{overflowX: 'hidden'}}>
          <span className="text-sm font-semibold text-[#0079C1] drop-shadow-sm mb-1">
            Powered by <span className="text-[#00AEEF]"> Nepserv Consults Ltd</span>
          </span>
          <span className="text-xs text-[#0079C1] space-x-1">
            <span>© 2025 Nepserv Consults Ltd. All rights reserved.</span>
            <a href="#" className="underline hover:text-[#00AEEF] ml-1">Terms of Use</a>
            <span className="mx-1 text-[#0079C1]">|</span>
            <a href="#" className="underline hover:text-[#00AEEF]">Privacy Policy</a>
          </span>
        </div>

        {/* Modal for business details */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-2 md:px-0" onClick={handleCloseModal}>
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 md:p-8 relative overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
              <button className="absolute top-2 right-2 text-gray-400 hover:text-[#0079C1]" onClick={handleCloseModal}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-[#0079C1] mb-4" />
                  <div className="text-[#0079C1] text-lg font-medium">Loading business details...</div>
                </div>
              ) : modalBusiness ? (
                <div>
                  <h2 className="text-xl font-bold text-[#0079C1] mb-2">{modalBusiness.display_name || modalBusiness.legal_name}</h2>
                  <div className="text-sm text-gray-600 mb-4">ID: {modalBusiness.id}</div>
                  {/* Tabs Navigation */}
                  <div className="flex border-b border-[#0079C1]/20 mb-6 w-full bg-white rounded-xl shadow border border-[#0079C1]/10">
                    {['overview', 'banking', 'contacts', 'attachments', 'addresses', 'images'].map((tab) => (
                      <button
                        key={tab}
                        className={`px-4 py-3 font-medium text-sm capitalize whitespace-nowrap transition-colors ${modalTab === tab ? 'text-[#0079C1] border-b-2 border-[#0079C1] font-semibold' : 'text-gray-600 hover:text-[#0079C1] hover:bg-[#0079C1]/5'}`}
                        onClick={() => setModalTab(tab)}
                      >
                        {tab.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                  {/* Tab Content */}
                  {modalTab === 'overview' && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-[#0079C1] mb-4">Business Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <div>
                          <div className="mb-2"><b>Legal Name:</b> {modalBusiness.legal_name}</div>
                          <div className="mb-2"><b>Trading Name:</b> {modalBusiness.trading_name}</div>
                          <div className="mb-2"><b>Ownership Type:</b> {modalBusiness.ownership_type}</div>
                          <div className="mb-2"><b>Display Name:</b> {modalBusiness.display_name}</div>
                          <div className="mb-2"><b>Business Type:</b> {modalBusiness.business_type}</div>
                        </div>
                        <div>
                          <div className="mb-2"><b>Website:</b> {modalBusiness.website_url ? (<a href={modalBusiness.website_url} target="_blank" rel="noopener noreferrer" className="text-[#0079C1] underline">{modalBusiness.website_url}</a>) : '-'}</div>
                          <div className="mb-2"><b>Contact Phone:</b> {modalBusiness.contact_phone}</div>
                          <div className="mb-2"><b>Email Address:</b> {modalBusiness.email_address}</div>
                          <div className="mb-2"><b>Registration Date:</b> {modalBusiness.registration_date}</div>
                          <div className="mb-2"><b>Registration Authority:</b> {modalBusiness.registration_authority}</div>
                        </div>
                      </div>
                      <div className="mb-4 mt-4"><b>Status:</b> <span className="capitalize px-2 py-1 rounded bg-gray-100 text-gray-800">{modalBusiness.status}</span></div>
                    </div>
                  )}
                  {modalTab === 'banking' && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-[#0079C1] mb-4">Bank Accounts</h3>
                      {modalBusiness.bank_info?.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                          {modalBusiness.bank_info.map((bi: any) => (
                            <div key={bi.bank_info_id} className="p-4 rounded-lg border border-[#0079C1]/20 bg-[#0079C1]/5 hover:bg-[#0079C1]/10 transition-colors">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><b>Bank Name:</b> {bi.bank_name}</div>
                                <div><b>Branch:</b> {bi.bank_branch}</div>
                                <div><b>Account Name:</b> {bi.account_name}</div>
                                <div><b>Account Type:</b> {bi.account_type}</div>
                                <div><b>Account Number:</b> {bi.account_number}</div>
                                <div><b>Status:</b> {bi.is_primary ? 'Primary' : 'Secondary'}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (<div className="text-gray-500 italic">No bank information available</div>)}
                    </div>
                  )}
                  {modalTab === 'contacts' && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-[#0079C1] mb-4">Business Contacts</h3>
                      {modalBusiness.contacts?.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                          {modalBusiness.contacts.map((c: any) => (
                            <div key={c.contact_id} className="p-4 rounded-lg border border-[#0079C1]/20 bg-[#0079C1]/5 hover:bg-[#0079C1]/10 transition-colors">
                              <div><b>Name:</b> {c.contact_name}</div>
                              <div><b>Position:</b> {c.contact_position}</div>
                              <div><b>Email:</b> {c.contact_email}</div>
                              <div><b>Phone 1:</b> {c.contact_phone_1}</div>
                              <div><b>Phone 2:</b> {c.contact_phone_2}</div>
                              <div><b>Address:</b> {c.physical_address}</div>
                            </div>
                          ))}
                        </div>
                      ) : (<div className="text-gray-500 italic">No contacts available</div>)}
                    </div>
                  )}
                  {modalTab === 'attachments' && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-[#0079C1] mb-4">Business Documents</h3>
                      {modalBusiness.attachments?.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                          {modalBusiness.attachments.map((a: any) => (
                            <div key={a.attachment_id} className="p-4 rounded-lg border border-[#0079C1]/20 bg-[#0079C1]/5">
                              <AttachmentPreview label="Business Name Cert" value={a.business_name_cert} onClick={src => setModalImg(src)} />
                              <AttachmentPreview label="Trade License" value={a.trade_license} onClick={src => setModalImg(src)} />
                              <AttachmentPreview label="Tax Cert" value={a.tax_cert} onClick={src => setModalImg(src)} />
                              <AttachmentPreview label="Passport Photo" value={a.passport_photo} onClick={src => setModalImg(src)} />
                              <div className="mb-3">
                                <h4 className="font-medium text-[#0079C1] mb-2">NIN ID</h4>
                                <div className="text-gray-800 text-sm">{a.nin_id || <span className="text-gray-400 italic">Not provided</span>}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (<div className="text-gray-500 italic">No attachments available</div>)}
                    </div>
                  )}
                  {modalTab === 'addresses' && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-[#0079C1] mb-4">Business Locations</h3>
                      {modalBusiness.addresses?.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                          {modalBusiness.addresses.map((addr: any) => (
                            <div key={addr.address_id} className="p-4 rounded-lg border border-[#0079C1]/20 bg-[#0079C1]/5 hover:bg-[#0079C1]/10 transition-colors">
                              <div><b>Region:</b> {addr.region_name}</div>
                              <div><b>District:</b> {addr.district_name}</div>
                              <div><b>County:</b> {addr.county_name}</div>
                              <div><b>Subcounty:</b> {addr.subcounty_name}</div>
                              <div><b>Parish:</b> {addr.parish_name}</div>
                              <div><b>Physical Address:</b> {addr.physical_address}</div>
                            </div>
                          ))}
                        </div>
                      ) : (<div className="text-gray-500 italic">No addresses available</div>)}
                    </div>
                  )}
                  {modalTab === 'images' && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-[#0079C1] mb-4">Business Images</h3>
                      {modalBusiness.images?.length ? (
                        <div className="flex flex-wrap gap-6 w-full justify-start">
                          {modalBusiness.images.map((img: any) => {
                            let imgSrc = img.image_data;
                            if (imgSrc) {
                              const isBase64 = (
                                imgSrc.length > 100 && /^[A-Za-z0-9+/=]+$/.test(imgSrc)
                              ) || imgSrc.startsWith('/9j/') || imgSrc.startsWith('iVBORw0KGgo') || imgSrc.startsWith('R0lGOD');
                              if (imgSrc.startsWith('http') || imgSrc.startsWith('/assets/') || imgSrc.startsWith('data:')) {
                                // Use as is
                              } else if (isBase64) {
                                let mime = 'image/jpeg';
                                if (imgSrc.startsWith('iVBORw0KGgo')) mime = 'image/png';
                                else if (imgSrc.startsWith('R0lGOD')) mime = 'image/gif';
                                imgSrc = `data:${mime};base64,${imgSrc}`;
                              } else {
                                imgSrc = `/assets/img/${imgSrc}`;
                              }
                            }
                            return (
                              <div key={img.image_id || img.id || Math.random()} className={`relative rounded-lg overflow-hidden border-2 ${img.is_cover_image ? 'border-[#0079C1]' : 'border-gray-200'} group cursor-pointer`}>
                                <img src={imgSrc} alt="Business" className="w-48 h-32 object-cover transition-transform group-hover:scale-105" />
                                <div className="absolute bottom-0 left-0 w-full bg-[#0079C1]/80 text-white text-xs text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to view full size</div>
                                {img.is_cover_image && (
                                  <div className="absolute top-2 right-2 bg-[#0079C1] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">Cover</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (<div className="text-gray-500 italic">No images available</div>)}
                    </div>
                  )}
                  {/* Actions */}
                  <div className="flex gap-4 justify-end mt-6">
                    <button
                      className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                      onClick={handleActivate}
                      disabled={modalLoading || modalBusiness.status === 'approved'}
                    >Activate</button>
                    <button
                      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                      onClick={handleDeactivate}
                      disabled={modalLoading || modalBusiness.status !== 'approved'}
                    >Deactivate</button>
                    <button
                      className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-black disabled:opacity-50"
                      onClick={() => setShowDeletePrompt(true)}
                      disabled={modalLoading}
                    >Delete</button>
                  </div>
                  {/* Delete Prompt Modal */}
                  {showDeletePrompt && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40 px-2 md:px-0">
                      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-[#0079C1]" onClick={() => setShowDeletePrompt(false)}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <h3 className="text-lg font-bold text-red-600 mb-4">Delete Business</h3>
                        <p className="mb-2 text-gray-700">Please provide a message to send to the business owner explaining the reason for deletion:</p>
                        <textarea
                          className="w-full border border-gray-300 rounded p-2 mb-4 min-h-[80px]"
                          value={deleteReason}
                          onChange={e => setDeleteReason(e.target.value)}
                          placeholder="Enter reason for deletion..."
                          disabled={modalLoading}
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                            onClick={() => setShowDeletePrompt(false)}
                            disabled={modalLoading}
                          >Cancel</button>
                          <button
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                            onClick={handleDeleteBusiness}
                            disabled={modalLoading || !deleteReason.trim()}
                          >Delete</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-red-500 font-medium">Business not found</div>
              )}
            </div>
          </div>
        )}
      </div>
  );
};
export default ApprovedBusinesses;
