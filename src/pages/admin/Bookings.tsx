"use client";
import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  CheckCircle,
  MoreHorizontal,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import apiService from "../../services/apiService";


interface Booking {
  id: string;
  customer: string;
  business: string;
  service: string;
  date: string;
  time: string;
  status: "confirmed" | "cancelled" | "completed" | "pending";
  amount: string;
}

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [loading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  // Helper placeholders for compilation
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "completed", label: "Completed" },
  ];

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || booking.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  function getStatusBadgeClass(status: string) {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "cancelled": return "bg-red-100 text-red-700";
      case "completed": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "pending": return <Loader2 className="h-3 w-3 mr-1 animate-spin" />;
      case "confirmed": return <Check className="h-3 w-3 mr-1" />;
      case "cancelled": return <X className="h-3 w-3 mr-1" />;
      case "completed": return <CheckCircle className="h-3 w-3 mr-1" />;
      default: return null;
    }
  }

  function handleUpdateStatus(id: string, status: string) {
    setActionLoading(`${status}-${id}`);
    apiService().sendPostToServer('admin/bookingsStatus', { bookingId: id, status })
      .then(() => {
        setActionLoading(null);
        toast.success(`Booking ${id} marked as ${status}`);
      })
      .catch((err: any) => {
        setActionLoading(null);
        toast.error(err?.message || 'Failed to update booking status');
      });
  }

  function handleExport() {
    apiService().sendPostToServer('admin/bookings/export', {})
      .then(() => {
        toast.success('Exported bookings!');
      })
      .catch((err: any) => {
        toast.error(err?.message || 'Failed to export bookings');
      });
  React.useEffect(() => {
    apiService().sendPostToServer('admin/bookings', { search: searchTerm || undefined, status: selectedStatus !== 'all' ? selectedStatus : undefined })
      .then((res: any) => {
        setBookings(res?.data || res?.returnObject || []);
      })
      .catch((err: any) => {
        toast.error(err?.message || 'Failed to load bookings');
        setBookings([]);
      });
  }, [searchTerm, selectedStatus]);
  }

  return (
  <div className="min-h-screen w-full">
      <div className="w-full h-full backdrop-blur-lg bg-white/20 rounded-none shadow-xl overflow-hidden border border-white/30 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0079C1]">Booking Management</h1>
              <p className="text-sm text-[#0079C1]/80 mt-1">
                View and manage all system bookings
              </p>
            </div>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 bg-[#00AEEF] text-white rounded-md hover:bg-[#0079C1] transition-colors"
            >
              Export Bookings
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white/80 p-4 rounded-lg shadow border border-white/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#0079C1]/60" />
                </div>
                <input
                  type="text"
                  placeholder="Search bookings..."
                  className="pl-10 w-full rounded-md border border-white/30 shadow-sm focus:border-[#00AEEF] focus:ring-[#00AEEF] bg-white/60"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <select
                  className="appearance-none w-full pl-3 pr-10 py-2 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-[#00AEEF] focus:border-[#00AEEF] bg-white/60"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-[#0079C1]/60" />
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white/80 rounded-lg shadow overflow-hidden border border-white/30">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/30">
                <thead className="bg-white/10">
                  <tr>
                    {[
                      "Customer",
                      "Business",
                      "Service",
                      "Date & Time",
                      "Amount",
                      "Status",
                      "Actions",
                    ].map((col, idx) => (
                      <th
                        key={idx}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-[#0079C1]/80 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white/10 divide-y divide-white/30">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#0079C1] mx-auto" />
                        <p className="mt-2 text-sm text-[#0079C1]/80">Loading bookings...</p>
                      </td>
                    </tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-[#0079C1]/80">
                        {searchTerm || selectedStatus !== "all"
                          ? "No bookings match your search criteria" 
                          : "No bookings found"}
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-white/20">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0079C1]">
                          {booking.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0079C1]">
                          {booking.business}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0079C1]/80">
                          {booking.service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0079C1]">
                          {booking.date}
                          <div className="text-sm text-[#0079C1]/80">{booking.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0079C1]">
                          {booking.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full capitalize ${getStatusBadgeClass(booking.status)}`}
                          >
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {booking.status === "pending" && (
                              <>
                                <StatusButton
                                  label="Confirm"
                                  icon={<Check className="h-3 w-3 mr-1" />}
                                  loading={actionLoading === `confirmed-${booking.id}`}
                                  onClick={() =>
                                    handleUpdateStatus(booking.id, "confirmed")
                                  }
                                  className="bg-[#00AEEF]/20 text-[#0079C1] hover:bg-[#00AEEF]/40 focus:ring-2 focus:ring-[#00AEEF]"
                                />
                                <StatusButton
                                  label="Cancel"
                                  icon={<X className="h-3 w-3 mr-1" />}
                                  loading={actionLoading === `cancelled-${booking.id}`}
                                  onClick={() =>
                                    handleUpdateStatus(booking.id, "cancelled")
                                  }
                                  className="bg-red-100 text-red-700 hover:bg-red-200 focus:ring-2 focus:ring-red-400"
                                />
                              </>
                            )}
                            {booking.status === "confirmed" && (
                              <StatusButton
                                label="Complete"
                                icon={<CheckCircle className="h-3 w-3 mr-1" />}
                                loading={actionLoading === `completed-${booking.id}`}
                                onClick={() =>
                                  handleUpdateStatus(booking.id, "completed")
                                }
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                              />
                            )}
                            <button className="text-xs px-3 py-1 rounded flex items-center bg-white/20 text-[#0079C1] hover:bg-white/40">
                              <MoreHorizontal className="h-3 w-3" />
                            </button>
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
}

const StatusButton = ({
  label,
  icon,
  loading,
  onClick,
  className,
}: {
  label: string;
  icon: React.ReactNode;
  loading: boolean;
  onClick: () => void;
  className: string;
}) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`text-xs px-3 py-1 rounded flex items-center ${className} ${
      loading ? "opacity-50" : ""
    }`}
  >
    {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : icon}
    {label}
  </button>
);

export default AdminBookings;