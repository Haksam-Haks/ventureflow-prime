"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, Trash2, ChevronDown, Loader2, Check, X } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from "react-hot-toast";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'business' | 'customer';
  isActive: boolean;
  isVerified: boolean;
  lastActive?: string;
  createdAt: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);


  const getUserStatus = (user: User): string => {
    if (!user.isVerified) return 'pending';
    return user.isActive ? 'active' : 'suspended';
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService().sendPostToServer('admin/users', {}) as { data: User[], message?: string };

      if (!Array.isArray(response.data)) {
        throw new Error(response.message || 'Invalid response format from server');
      }

      setUsers(response.data);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error?.message || 'Failed to load users. Please try again.');
      toast.error(error?.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedRole, selectedStatus]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();
    };

    const debounceTimer = setTimeout(fetchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [fetchUsers]);

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setActionLoading(`delete-${userId}`);
      const response = await apiService().sendPostToServer(`admin/delete`, { id: userId }) as { message?: string };
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      toast.success(response?.message || "User deleted successfully");
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error?.message || "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'suspended') => {
    try {
      setActionLoading(`status-${userId}`);
      const response = await apiService().sendPostToServer(`admin/status`, { userId, status: newStatus }) as { message?: string };
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { 
            ...user, 
            isActive: newStatus === 'active',
            isVerified: newStatus === 'active' ? true : user.isVerified
          } : user
        )
      );
      toast.success(response?.message || `User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast.error(error?.message || `Failed to ${newStatus === 'active' ? 'activate' : 'suspend'} user`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'business', label: 'Business' },
    { value: 'customer', label: 'Customer' },
  ];
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'pending', label: 'Pending' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const status = getUserStatus(user);
    const matchesStatus = selectedStatus === 'all' || status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
  <div className="min-h-screen w-full">
      <div className="w-full h-full backdrop-blur-lg bg-white/20 rounded-none shadow-xl overflow-hidden border border-white/30 flex">
        {/* Main Content */}
        <div className="flex-1 p-8 backdrop-blur-sm bg-white/10 flex flex-col min-h-full">
          <main className="w-full">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#0079C1]">User Management</h1>
                  <p className="text-sm text-[#0079C1]/80 mt-1">Manage all system users and their permissions</p>
                </div>
              </div>
              {/* Filters */}
              <div className="bg-white/80 p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-[#0079C1]/60" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 w-full rounded-md border border-[#0079C1]/30 shadow-sm focus:border-[#0079C1] focus:ring-[#0079C1] bg-white/90"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <select
                      className="appearance-none w-full pl-3 pr-10 py-2 border border-[#0079C1]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#0079C1] focus:border-[#0079C1] bg-white/90"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      {roleOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-[#0079C1]/60" />
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      className="appearance-none w-full pl-3 pr-10 py-2 border border-[#0079C1]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#0079C1] focus:border-[#0079C1] bg-white/90"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-[#0079C1]/60" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Users Table */}
              <div className="bg-white/80 rounded-lg shadow overflow-hidden border border-white/60">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#0079C1]/20">
                    <thead className="bg-white/10">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase text-[#0079C1]/80 tracking-wider">User</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase text-[#0079C1]/80 tracking-wider">Role</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase text-[#0079C1]/80 tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase text-[#0079C1]/80 tracking-wider">Last Active</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase text-[#0079C1]/80 tracking-wider">Created</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase text-[#0079C1]/80 tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/10 divide-y divide-[#0079C1]/10">
                      {error ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center">
                            <div className="text-red-500">{error}</div>
                            <button
                              onClick={fetchUsers}
                              className="mt-4 px-4 py-2 bg-gradient-to-r from-[#0079C1] to-[#00AEEF] text-white rounded-md hover:from-[#00AEEF] hover:to-[#0079C1] transition-colors"
                            >
                              Retry
                            </button>
                          </td>
                        </tr>
                      ) : loading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center">
                            <div className="flex justify-center">
                              <Loader2 className="h-8 w-8 animate-spin text-[#0079C1]" />
                            </div>
                            <p className="mt-2 text-sm text-[#0079C1]/80">Loading users...</p>
                          </td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-[#0079C1]/80">
                            No users found matching your criteria
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => {
                          const status = getUserStatus(user);
                          return (
                            <tr key={user.id} className="hover:bg-[#0079C1]/5">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#0079C1]/10 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-[#0079C1]/60" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-[#0079C1]">{user.firstName} {user.lastName}</div>
                                    <div className="text-sm text-[#0079C1]/80">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                                  user.role === 'admin'
                                    ? 'bg-purple-100 text-purple-800'
                                    : user.role === 'business'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-green-100 text-green-800'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full capitalize ${
                                  status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : status === 'suspended'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {status === 'active' ? (
                                    <Check className="h-3 w-3 mr-1" />
                                  ) : status === 'suspended' ? (
                                    <X className="h-3 w-3 mr-1" />
                                  ) : null}
                                  {status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0079C1]/80">{formatDate(user.lastActive || '')}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0079C1]/80">{formatDate(user.createdAt || '')}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                  {status !== 'pending' && (
                                    <button
                                      onClick={() => handleStatusChange(
                                        user.id,
                                        status === 'active' ? 'suspended' : 'active'
                                      )}
                                      disabled={actionLoading === `status-${user.id}`}
                                      className={`text-xs px-3 py-1 rounded flex items-center ${
                                        status === 'active'
                                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                                      } ${actionLoading === `status-${user.id}` ? 'opacity-50' : ''}`}
                                    >
                                      {actionLoading === `status-${user.id}` ? (
                                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                      ) : null}
                                      {status === 'active' ? 'Suspend' : 'Activate'}
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={actionLoading === `delete-${user.id}`}
                                    className={`text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center ${
                                      actionLoading === `delete-${user.id}` ? 'opacity-50' : ''
                                    }`}
                                  >
                                    {actionLoading === `delete-${user.id}` ? (
                                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                    ) : (
                                      <Trash2 className="h-3 w-3 mr-1" />
                                    )}
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;