import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/apiService';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Listing {
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

const ListingApprovals: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await apiService().sendPostToServer<any>('admin/listings/pending', {});
        let list: Listing[] = [];
        if (res?.success && Array.isArray(res?.returnObject || res?.data)) {
          list = (res.returnObject || res.data).map((l: any) => ({
            id: l.id,
            title: l.title,
            type: l.type,
            status: l.status,
            owner_name: l.owner_name || l.ownerName,
            owner_email: l.owner_email || l.ownerEmail,
            created_at: l.created_at || l.createdAt,
            last_updated_at: l.last_updated_at || l.lastUpdatedAt,
          }));
        } else {
          toast.error('Failed to load pending listings');
        }
        setListings(list);
      } catch (err) {
        setListings([]);
        toast.error('Failed to load pending listings');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <div className="flex-1 max-w-5xl p-8 flex flex-col min-h-full rounded-lg shadow-lg border border-white/60 bg-white">
          <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#0079C1]">Pending Listings</h1>
          </div>
          <div className="bg-white/80 rounded-lg shadow overflow-hidden border border-white/30">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/30">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#0079C1]/80 uppercase tracking-wider whitespace-nowrap">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#0079C1]/80 uppercase tracking-wider whitespace-nowrap">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#0079C1]/80 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#0079C1]/80 uppercase tracking-wider whitespace-nowrap">Owner Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#0079C1]/80 uppercase tracking-wider whitespace-nowrap">Owner Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#0079C1]/80 uppercase tracking-wider whitespace-nowrap">Created At</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#0079C1]/80 uppercase tracking-wider whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/10 divide-y divide-white/30">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#0079C1] mx-auto" />
                        <p className="mt-2 text-sm text-[#0079C1]/80">Loading listings...</p>
                      </td>
                    </tr>
                  ) : listings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-[#0079C1]/80">
                        No pending listings
                      </td>
                    </tr>
                  ) : (
                    listings.map((l) => (
                      <tr key={l.id} className="hover:bg-white/20">
                        <td className="px-4 py-4 whitespace-nowrap font-medium text-[#0079C1]">
                          <Link to={`/admin/listing/${l.id}`} className="text-[#00AEEF] hover:underline">{l.title}</Link>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#0079C1]">{l.type}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#0079C1]">{l.status}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#0079C1]">{l.owner_name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#0079C1]">{l.owner_email}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#0079C1]/80">{l.created_at}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#0079C1]">
                          <Link to={`/admin/listing/${l.id}`} className="text-[#00AEEF] hover:underline">View</Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Powered by footer */}
          <div className="w-full flex flex-col items-center justify-center py-4 px-2 text-center mt-6">
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
      </div>
    );
};

export default ListingApprovals;
