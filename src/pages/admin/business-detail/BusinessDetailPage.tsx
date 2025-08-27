import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from '../../../contexts/AuthContext';
import apiService from "../../../services/apiService";
import toast from "react-hot-toast";
import { Business, BusinessImage } from "../../../types/types";

const BusinessDetailPage: React.FC = () => {
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [modalLabel, setModalLabel] = useState<string | null>(null);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (modalImg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalImg]);
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext as unknown as React.Context<{ user: any }>);
  // Assumes AuthContext provides current admin user
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectLoading, setRejectLoading] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      setLoading(true);
      try {
        const res = await apiService().sendPostToServer<{ returnObject?: Business; data?: Business }>(
          `admin/get/full-info`, 
          { businessId: id }
        );
        const b = res?.returnObject || res?.data;
        if (b) setBusiness(b);
        else toast.error('Business not found');
      } catch (err) {
        toast.error('Failed to fetch business details');
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id]);

  const handleAction = async (action: 'approve' | 'reject' | 'update') => {
    if (action === 'reject') {
      setShowRejectModal(true);
      return;
    }
    try {
      let payload: any = { businessId: id };
      let endpoint = '';
      if (action === 'update' && business) {
        endpoint = '/admin/businesses/update';
        payload = { ...payload, display_name: business.display_name + ' (Updated)' };
      } else if (action === 'approve') {
        endpoint = 'admin/approve';
        payload.lastUpdatedBy = user?.id; // Add admin user ID
      }
      const res = await apiService().sendPostToServer<{ success?: boolean; message?: string }>(
        endpoint,
        payload
      );
      if (res?.success) {
        toast.success(res?.message || `Business ${action}d successfully`);
        if (action !== 'update') {
          navigate('/admin/approvals');
        } else if (business) {
          setBusiness({ ...business, display_name: business.display_name + ' (Updated)' });
        }
      } else {
        toast.error(res?.message || `Failed to ${action} business`);
      }
    } catch (err: any) {
      toast.error(err?.message || `Failed to ${action} business`);
    }
  };

  const submitReject = async () => {
    setRejectLoading(true);
    try {
      const payload = { businessId: id, reason: rejectReason };
      const res = await apiService().sendPostToServer<{ success?: boolean; message?: string }>(
        'admin/reject',
        payload
      );
      if (res?.success) {
        toast.success(res?.message || 'Business rejected successfully');
        navigate('/admin/approvals');
      } else {
        toast.error(res?.message || 'Failed to reject business');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reject business');
    } finally {
      setRejectLoading(false);
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  if (loading || !business) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0079C1]/5 to-[#00AEEF]/5">
        <div className="max-w-3xl w-full mx-4 p-8 bg-white rounded-xl shadow-lg border border-[#0079C1]/20">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0079C1] mb-4"></div>
              <div className="text-[#0079C1] text-lg font-medium">Loading business details...</div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-red-500 font-medium text-lg mb-2">Business not found</div>
              <button 
                onClick={() => navigate(-1)}
                className="mt-4 text-[#0079C1] hover:text-[#00AEEF] font-medium"
              >
                ← Back to businesses
              </button>
            </div>
          )}
          <Footer />
        </div>
      </div>
    );
  }

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#0079C1]/5 to-[#00AEEF]/5 overflow-x-hidden">
    <div className="w-full h-full px-0 py-0 flex flex-col items-center overflow-x-hidden" style={{maxWidth:'100vw'}}>
        {/* Header Card */}
  <div className="bg-white rounded-2xl shadow-lg border border-[#0079C1]/10 mb-6 w-full max-w-[100vw] mx-auto overflow-x-hidden">
          <div className="flex flex-col md:flex-row gap-8 p-8 items-start">
            {/* Business Info Card */}
            <div className="flex-shrink-0 w-full md:w-1/3 flex flex-col items-center justify-center">
              <div className="w-40 h-40 bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                {business.images?.find((img: { is_cover_image: any; }) => img.is_cover_image) ? (
                  <img
                    src={(() => {
                      const img = business.images.find((img: { is_cover_image: any; }) => img.is_cover_image);
                      let imgSrc = img.image_data;
                      if (imgSrc) {
                        const isBase64 = (
                          imgSrc.length > 100 && /^[A-Za-z0-9+/=]+$/.test(imgSrc)
                        ) || imgSrc.startsWith('/9j/') || imgSrc.startsWith('iVBORw0KGgo') || imgSrc.startsWith('R0lGOD');
                        if (imgSrc.startsWith('http') || imgSrc.startsWith('/assets/') || imgSrc.startsWith('data:')) {
                          return imgSrc;
                        } else if (isBase64) {
                          let mime = 'image/jpeg';
                          if (imgSrc.startsWith('iVBORw0KGgo')) mime = 'image/png';
                          else if (imgSrc.startsWith('R0lGOD')) mime = 'image/gif';
                          return `data:${mime};base64,${imgSrc}`;
                        } else {
                          return `/assets/img/${imgSrc}`;
                        }
                      }
                      return '';
                    })()}
                    alt="Cover"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#0079C1]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-[#0079C1] mb-1">{business.display_name || business.legal_name}</h2>
                <div className="text-sm text-gray-600 mb-2">ID: {business.id}</div>
                <div className="flex flex-wrap gap-2 justify-center mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${business.status === 'active' ? 'bg-green-100 text-green-800' : business.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{(business.status ?? 'unknown').toUpperCase()}</span>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{business.business_type_id}</span>
                </div>
              </div>
            </div>
            {/* Business Details */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              <DetailCard 
                items={[{ label: "Legal Name", value: business.legal_name },{ label: "Trading Name", value: business.trading_name },{ label: "Ownership Type", value: business.ownership_type },{ label: "Display Name", value: business.display_name }]}
              />
              <DetailCard 
                items={[{ label: "Website", value: business.website_url, isLink: true },{ label: "Contact Phone", value: business.contact_phone, isPhone: true },{ label: "Email Address", value: business.email_address, isEmail: true },{ label: "Registration Date", value: business.registration_date },{ label: "Registration Authority", value: business.registration_authority }]}
              />
            </div>
            <div className="flex gap-3 flex-wrap mt-4 md:mt-0 md:ml-8">
              <button className="bg-gradient-to-r from-[#0079C1] to-[#00AEEF] text-white px-4 py-2 rounded-lg hover:from-[#00AEEF] hover:to-[#0079C1] font-medium shadow-md transition-all duration-300 text-sm flex items-center gap-1" onClick={() => handleAction('approve')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Approve
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium shadow-md transition-all duration-300 text-sm flex items-center gap-1" onClick={() => handleAction('reject')}>
      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-60" onClick={() => setShowRejectModal(false)}>
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-400 hover:text-[#0079C1]" onClick={() => setShowRejectModal(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-semibold text-[#0079C1] mb-4">Reject Business</h2>
            <label className="block mb-2 text-sm font-medium text-gray-700">Reason for rejection:</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 min-h-[80px] focus:outline-[#0079C1] text-gray-800"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              disabled={rejectLoading}
            />
            <div className="flex gap-3 justify-end">
              <button
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium"
                onClick={() => setShowRejectModal(false)}
                disabled={rejectLoading}
              >Cancel</button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
                onClick={submitReject}
                disabled={rejectLoading || !rejectReason.trim()}
              >{rejectLoading ? 'Rejecting...' : 'Submit Rejection'}</button>
            </div>
          </div>
        </div>
      )}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg> Reject
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
  <div className="flex overflow-x-hidden border-b border-[#0079C1]/20 mb-6 scrollbar-hide w-full mx-auto bg-white rounded-xl shadow border border-[#0079C1]/10" style={{maxWidth:'100vw'}}>
          {['overview', 'banking', 'contacts', 'attachments', 'addresses'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-3 font-medium text-sm capitalize whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'text-[#0079C1] border-b-2 border-[#0079C1] font-semibold' 
                  : 'text-gray-600 hover:text-[#0079C1] hover:bg-[#0079C1]/5'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Main Content Card */}
  <div className="bg-white rounded-2xl shadow-lg border border-[#0079C1]/10 mb-8 w-full max-w-[100vw] mx-auto overflow-x-hidden">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#0079C1] mb-4 pb-2 border-b border-[#0079C1]/20">
                  Business Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                  <div className="space-y-4">
                    <DetailCard 
                      items={[
                        { label: "Legal Name", value: business.legal_name },
                        { label: "Trading Name", value: business.trading_name },
                        { label: "Ownership Type", value: business.ownership_type },
                        { label: "Display Name", value: business.display_name },
                      ]}
                    />
                  </div>
                  <div className="space-y-4">
                    <DetailCard 
                      items={[
                        { label: "Website", value: business.website_url, isLink: true },
                        { label: "Contact Phone", value: business.contact_phone, isPhone: true },
                        { label: "Email Address", value: business.email_address, isEmail: true },
                        { label: "Registration Date", value: business.registration_date },
                        { label: "Registration Authority", value: business.registration_authority },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div>
                <h2 className="text-xl font-semibold text-[#0079C1] mb-4 pb-2 border-b border-[#0079C1]/20">
                  Business Images
                </h2>
                <div className="flex flex-wrap gap-6 w-full justify-start">
                  {business.images?.length ? (
                    business.images.map((img: any) => (
                      <ImageCard
                        key={img.image_id}
                        image={{
                          id: img.image_id ?? img.id ?? '',
                          image_data: img.image_data ?? '',
                          business_id: img.business_id,
                          image_name: img.image_name,
                          is_cover_image: img.is_cover_image,
                          created_at: img.created_at,
                          updated_at: img.updated_at,
                        }}
                        onClick={(src: string) => { setModalImg(src); setModalLabel(img.image_name || 'Business Image'); }}
                      />
                    ))
                  ) : (
                    <EmptyState message="No images available" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Banking Tab */}
          {activeTab === 'banking' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#0079C1] mb-4 pb-2 border-b border-[#0079C1]/20">
                Bank Accounts
              </h2>
              {business.bank_info?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  {business.bank_info.map((bi: { bank_info_id: Key | null | undefined; bank_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; bank_branch: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; account_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; account_type: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; currency: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; account_number: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; is_primary: any; }) => (
                    <div key={bi.bank_info_id} className="p-4 rounded-lg border border-[#0079C1]/20 bg-[#0079C1]/5 hover:bg-[#0079C1]/10 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailItem label="Bank Name" value={bi.bank_name} />
                        <DetailItem label="Branch" value={bi.bank_branch} />
                        <DetailItem label="Account Name" value={bi.account_name} />
                        <DetailItem label="Account Type" value={bi.account_type} />
                        <DetailItem label="Account Number" value={bi.account_number} />
                        <DetailItem 
                          label="Status" 
                          value={
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              bi.is_primary 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {bi.is_primary ? 'Primary Account' : 'Secondary Account'}
                            </span>
                          } 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No bank information available" />
              )}
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#0079C1] mb-4 pb-2 border-b border-[#0079C1]/20">
                Business Contacts
              </h2>
              {business.contacts?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  {business.contacts.map((c: { contact_id: Key | null | undefined; contact_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; is_primary: any; contact_position: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; contact_email: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; contact_phone_1: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; contact_phone_2: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; physical_address: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; region_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; district_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; county_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; subcounty_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; parish_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                    <div key={c.contact_id} className="p-4 rounded-lg border border-[#0079C1]/20 bg-[#0079C1]/5 hover:bg-[#0079C1]/10 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-[#0079C1]">{c.contact_name}</h3>
                        {c.is_primary && (
                          <span className="text-xs bg-[#0079C1] text-white px-2 py-1 rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <DetailItem label="Position" value={c.contact_position} />
                        <DetailItem label="Email" value={c.contact_email} isEmail />
                        <DetailItem label="Phone 1" value={c.contact_phone_1} isPhone />
                        {c.contact_phone_2 && <DetailItem label="Phone 2" value={c.contact_phone_2} isPhone />}
                        {c.physical_address && <DetailItem label="Address" value={c.physical_address} />}
                        
                        <div className="pt-2 mt-2 border-t border-[#0079C1]/10">
                          <h4 className="text-sm font-medium text-[#0079C1] mb-1">Location</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {c.region_name && <DetailItem small label="Region" value={c.region_name} />}
                            {c.district_name && <DetailItem small label="District" value={c.district_name} />}
                            {c.county_name && <DetailItem small label="County" value={c.county_name} />}
                            {c.subcounty_name && <DetailItem small label="Subcounty" value={c.subcounty_name} />}
                            {c.parish_name && <DetailItem small label="Parish" value={c.parish_name} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No contacts available" />
              )}
            </div>
          )}

          {/* Attachments Tab */}
          {activeTab === 'attachments' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#0079C1] mb-4 pb-2 border-b border-[#0079C1]/20">
                Business Documents
              </h2>
              {business.attachments?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  {business.attachments.map((a: { attachment_id: Key | null | undefined; business_name_cert: string | undefined; trade_license: string | undefined; tax_cert: string | undefined; passport_photo: string | undefined; nin_id: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                    <div key={a.attachment_id} className="p-4 rounded-lg border border-[#0079C1]/20 bg-[#0079C1]/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AttachmentPreview 
                          label="Business Name Certificate" 
                          value={a.business_name_cert} 
                          onClick={(src: string) => { setModalImg(src); setModalLabel('Business Name Certificate'); }}
                        />
                        <AttachmentPreview 
                          label="Trade License" 
                          value={a.trade_license} 
                          onClick={(src: string) => { setModalImg(src); setModalLabel('Trade License'); }}
                        />
                        <AttachmentPreview 
                          label="Tax Certificate" 
                          value={a.tax_cert} 
                          onClick={(src: string) => { setModalImg(src); setModalLabel('Tax Certificate'); }}
                        />
                        <AttachmentPreview 
                          label="Passport Photo" 
                          value={a.passport_photo} 
                          onClick={(src: string) => { setModalImg(src); setModalLabel('Passport Photo'); }}
                        />
                      </div>
                      {a.nin_id && (
                        <div className="mt-4 pt-3 border-t border-[#0079C1]/10">
                          <DetailItem label="National ID Number" value={a.nin_id} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No attachments available" />
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#0079C1] mb-4 pb-2 border-b border-[#0079C1]/20">
                Business Locations
              </h2>
              {business.addresses?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  {business.addresses.map((addr: { address_id: Key | null | undefined; region_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; district_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; county_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; subcounty_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; parish_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; physical_address: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                    <div key={addr.address_id} className="p-4 rounded-lg border border-[#0079C1]/20 bg-[#0079C1]/5 hover:bg-[#0079C1]/10 transition-colors">
                      <div className="grid grid-cols-2 gap-2">
                        {addr.region_name && <DetailItem small label="Region" value={addr.region_name} />}
                        {addr.district_name && <DetailItem small label="District" value={addr.district_name} />}
                        {addr.county_name && <DetailItem small label="County" value={addr.county_name} />}
                        {addr.subcounty_name && <DetailItem small label="Subcounty" value={addr.subcounty_name} />}
                        {addr.parish_name && <DetailItem small label="Parish" value={addr.parish_name} />}
                      </div>
                      {addr.physical_address && (
                        <div className="mt-3 pt-2 border-t border-[#0079C1]/10">
                          <DetailItem label="Physical Address" value={addr.physical_address} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No addresses available" />
              )}
            </div>
          )}
        </div>

        <Footer />
        {/* Modal for full-size image */}
        {modalImg && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70" style={{ overscrollBehavior: 'contain' }} onClick={() => setModalImg(null)}>
            <div className="relative max-w-3xl w-full mx-4" onClick={e => e.stopPropagation()}>
              <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow" onClick={() => setModalImg(null)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0079C1]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="bg-white rounded-lg p-4 flex flex-col items-center">
                {modalLabel && <div className="mb-2 text-[#0079C1] font-semibold">{modalLabel}</div>}
                <img src={modalImg} alt={modalLabel || "Attachment"} className="max-h-[80vh] w-auto object-contain rounded-lg shadow" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
interface DetailItemProps {
  label: string;
  value: ReactNode;
  small?: boolean;
  isEmail?: boolean;
  isPhone?: boolean;
  isLink?: boolean;
}

const DetailItem = ({ label, value, small = false, isEmail = false, isPhone = false, isLink = false }: DetailItemProps) => {
  let content = value;
  
  if (isEmail && typeof value === 'string') {
    content = <a href={`mailto:${value}`} className="text-[#0079C1] hover:text-[#00AEEF]">{value}</a>;
  } else if (isPhone && typeof value === 'string') {
    content = <a href={`tel:${value}`} className="text-[#0079C1] hover:text-[#00AEEF]">{value}</a>;
  } else if (isLink && typeof value === 'string' && value) {
    content = (
      <a 
        href={value.startsWith('http') ? value : `https://${value}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-[#0079C1] hover:text-[#00AEEF] break-all"
      >
        {value.replace(/^https?:\/\//, '')}
      </a>
    );
  }

  return (
    <div className={`${small ? 'text-sm' : ''}`}>
      <span className={`font-medium ${small ? 'text-gray-600' : 'text-[#0079C1]'}`}>{label}:</span>{' '}
      <span className={value ? (small ? 'text-gray-700' : 'text-gray-800') : 'text-gray-400 italic'}>
        {content || 'Not provided'}
      </span>
    </div>
  );
};

interface DetailCardProps {
  items: {
    label: string;
    value: ReactNode;
    isEmail?: boolean;
    isPhone?: boolean;
    isLink?: boolean;
  }[];
}

const DetailCard = ({ items }: DetailCardProps) => (
  <div className="space-y-3">
    {items.map((item, index) => (
      <DetailItem 
        key={index}
        label={item.label}
        value={item.value}
        isEmail={item.isEmail}
        isPhone={item.isPhone}
        isLink={item.isLink}
      />
    ))}
  </div>
);

const ImageCard = ({ image, onClick }: { image: BusinessImage, onClick: (src: string) => void }) => {
  let imgSrc = image.image_data;
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
    <div className={`relative rounded-lg overflow-hidden border-2 ${
      image.is_cover_image ? 'border-[#0079C1]' : 'border-gray-200'
    } group cursor-pointer`} onClick={() => onClick(imgSrc)}>
      <img 
        src={imgSrc} 
        alt="Business" 
        className="w-48 h-32 object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 w-full bg-[#0079C1]/80 text-white text-xs text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to view full size</div>
      {image.is_cover_image && (
        <div className="absolute top-2 right-2 bg-[#0079C1] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Cover
        </div>
      )}
    </div>
  );
};

interface AttachmentPreviewProps {
  label: string;
  value?: string;
  onClick?: (src: string) => void;
}

const AttachmentPreview = ({ label, value, onClick }: AttachmentPreviewProps) => {
  const imgSrc = value ? getAttachmentImgSrc(value) : null;

  return (
    <div>
      <h4 className="font-medium text-[#0079C1] mb-2">{label}</h4>
      {imgSrc ? (
        <div className="border border-[#0079C1]/20 rounded-lg overflow-hidden group cursor-pointer" onClick={() => onClick && onClick(imgSrc)}>
          <img 
            src={imgSrc} 
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

const getAttachmentImgSrc = (val: string) => {
  if (!val) return undefined;
  const isBase64 = (
    val.length > 100 && /^[A-Za-z0-9+/=]+$/.test(val)
  ) || val.startsWith('/9j/') || val.startsWith('iVBORw0KGgo') || val.startsWith('R0lGOD');
  if (val.startsWith('http') || val.startsWith('/assets/') || val.startsWith('data:')) {
    return val;
  } else if (isBase64) {
    let mime = 'image/jpeg';
    if (val.startsWith('iVBORw0KGgo')) mime = 'image/png';
    else if (val.startsWith('R0lGOD')) mime = 'image/gif';
    return `data:${mime};base64,${val}`;
  } else {
    return `/assets/img/${val}`;
  }
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div className="mt-2 font-medium">{message}</div>
  </div>
);

const Footer = () => (
  <div className="w-full flex flex-col items-center justify-center py-6 px-2 text-center">
    <div className="mb-2">
      <span className="text-sm font-semibold text-[#0079C1]">
        Powered by <span className="text-[#00AEEF]">Nepserv Consults Ltd</span>
      </span>
    </div>
    <div className="text-xs text-[#0079C1] flex flex-wrap justify-center gap-x-2">
      <span>© 2025 Nepserv Consults Ltd. All rights reserved.</span>
      <a href="#" className="underline hover:text-[#00AEEF]">Terms of Use</a>
      <span>|</span>
      <a href="#" className="underline hover:text-[#00AEEF]">Privacy Policy</a>
    </div>
  </div>
);

export default BusinessDetailPage;