import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ListingDetail {
  id: string;
  title: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  owner_name?: string;
  owner_email?: string;
  created_at?: string;
  last_updated_at?: string;
  // Add more fields as needed
}

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const res = await apiService().sendPostToServer<any>('admin/listings/pending', { id });
        if (res?.success && (res.returnObject || res.data)) {
          setListing(res.returnObject || res.data);
        } else {
          setListing(null);
          toast.error(res?.message || 'Failed to load listing details');
        }
      } catch (err: any) {
        setListing(null);
        toast.error(err?.message || 'Failed to load listing details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  // Unified full-page layout following AdminDashboard style
  return (
  <div className="min-h-screen w-full">
      <div className="w-full h-full backdrop-blur-lg bg-white/20 rounded-none shadow-xl overflow-hidden border border-white/30 p-8 flex flex-col items-center justify-center">
        <div className="flex-1 w-full max-w-3xl mx-auto bg-white/80 rounded-lg shadow-lg border border-white/60 p-8 mb-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-[#0079C1]" />
            </div>
          ) : !listing ? (
            <div className="flex justify-center items-center h-64">
              <span className="text-center text-[#0079C1]/80 py-8 text-lg">Listing not found.</span>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4 text-[#0079C1]">Listing Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="font-semibold text-[#0079C1]">Title:</span> {listing.title}</div>
                <div><span className="font-semibold text-[#0079C1]">Type:</span> {listing.type}</div>
                <div><span className="font-semibold text-[#0079C1]">Status:</span> {listing.status}</div>
                <div><span className="font-semibold text-[#0079C1]">Owner Name:</span> {listing.owner_name}</div>
                <div><span className="font-semibold text-[#0079C1]">Owner Email:</span> {listing.owner_email}</div>
                <div><span className="font-semibold text-[#0079C1]">Created At:</span> {listing.created_at}</div>
                <div><span className="font-semibold text-[#0079C1]">Last Updated:</span> {listing.last_updated_at}</div>
                {/* Add more fields as needed */}
              </div>
              <div className="mt-8 flex gap-4">
                <button
                  className="px-4 py-2 bg-[#00AEEF] text-white rounded hover:bg-[#0079C1] transition-colors"
                  onClick={async () => {
                    const res = await apiService().sendPostToServer('admin/listings/approve', { id: listing.id }) as { message?: string };
                    toast.success(res?.message || 'Listing approved successfully');
                    navigate('/admin/listing-approvals');
                  }}
                >
                  Approve
                </button>
                <button
                  className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  onClick={async () => {
                    const res = await apiService().sendPostToServer('admin/listings/reject', { id: listing.id }) as { message?: string };
                    toast.success(res?.message || 'Listing rejected successfully');
                    navigate('/admin/listing-approvals');
                  }}
                >
                  Reject
                </button>
              </div>
            </>
          )}
        </div>
        {/* Powered by footer */}
        <div className="w-full flex flex-col items-center justify-center py-4 px-2 text-center bg-transparent mt-6">
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
      </div>
    </div>
  );
};

export default ListingDetailPage;
