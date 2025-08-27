"use client";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Clock, Download, Loader2 } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from "react-hot-toast";

interface Business {
  name: any;
  type: any;
  contact: any;
  email: any;
  phone: any;
  id: string;
  business_type?: string;
  legal_name?: string;
  trading_name?: string;
  ownership_type?: string;
  display_name?: string;
  website_url?: string;
  contact_phone?: string;
  email_address?: string;
  registration_date?: string;
  registration_authority?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

const PendingApprovals: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // Added search functionality

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
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
        toast.error(err instanceof Error ? err.message : 'Failed to load business approvals');
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  // Only show businesses with status 'pending' and matching search
  const filteredBusinesses = businesses.filter(business => {
    if (business.status !== 'pending') return false;
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
      link.setAttribute('download', `business_approvals_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'approved':
        return <Check className="h-3 w-3 mr-1" />;
      case 'rejected':
        return <X className="h-3 w-3 mr-1" />;
      default:
        return null;
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
  <div className="min-h-screen w-full">
      <div className="w-full h-full backdrop-blur-lg bg-white/20 rounded-none shadow-xl overflow-hidden border border-white/30 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0079C1]">Pending Approvals</h1>
              <p className="text-sm text-[#0079C1]/80 mt-1">
                Review and approve new business registrations
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
          <div className="bg-white/80 p-4 rounded-lg shadow border border-white/30">
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

          {/* Business Approvals Table */}
          <div className="bg-white/80 rounded-lg shadow overflow-hidden border border-white/30">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/30">
                <thead className="bg-white/10">
                  <tr>
                    {['ID','Business Type','Legal Name','Trading Name','Ownership Type','Display Name','Website','Contact Phone','Email','Registration Date','Registration Authority','Status','Created At','Updated At','Actions'].map(
                      (col) => (
                        <th
                          key={col}
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-[#0079C1]/80 uppercase tracking-wider"
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white/10 divide-y divide-white/30">
                  {loading ? (
                    <tr>
                      <td colSpan={15} className="px-6 py-8 text-center">
                        <div className="flex justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-[#0079C1]" />
                        </div>
                        <p className="mt-2 text-sm text-[#0079C1]/80">Loading business approvals...</p>
                      </td>
                    </tr>
                  ) : filteredBusinesses.length === 0 ? (
                    <tr>
                      <td colSpan={15} className="px-6 py-4 text-center text-[#0079C1]/80">
                        {searchTerm ? 'No businesses match your search' : 'No pending business approvals found'}
                      </td>
                    </tr>
                  ) : (
                    filteredBusinesses.map((business) => (
                      <tr key={business.id} className="hover:bg-white/20">
                        <td className="px-4 py-4 whitespace-nowrap">{business.id}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{business.business_type || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{business.legal_name || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{business.trading_name || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{business.ownership_type || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{business.display_name || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{business.website_url ? <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="text-[#0079C1] underline">{business.website_url}</a> : '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{business.contact_phone || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{business.email_address || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{business.registration_date ? formatDate(business.registration_date) : '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{business.registration_authority || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full capitalize ${getStatusBadgeClass(business.status)}`}>
                            {getStatusIcon(business.status)}
                            {business.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">{business.created_at ? formatDate(business.created_at) : '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{business.updated_at ? formatDate(business.updated_at) : '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/admin/businesses/${business.id}`}
                              className="text-xs px-3 py-1 rounded flex items-center bg-[#00AEEF]/20 text-[#0079C1] hover:bg-[#00AEEF]/40"
                            >
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
    </div>
  );
};
export default PendingApprovals;