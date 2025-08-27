
import React from 'react';
import { User, Mail, Phone, MapPin, Edit } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

const ProfilePage: React.FC = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-8 text-white relative">
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-3 mr-4">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-green-100">{user.email}</p>
              </div>
            </div>
            <button className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <Edit className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Profile Details */}
          <div className="p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <User className="h-5 w-5 mr-2 text-gray-400" />
                      First Name
                    </label>
                    <div className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {user.firstName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <User className="h-5 w-5 mr-2 text-gray-400" />
                      Last Name
                    </label>
                    <div className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {user.lastName}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-gray-400" />
                      Email Address
                    </label>
                    <div className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {user.email}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-gray-400" />
                      Phone Number
                    </label>
                    <div className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {user.phoneNumber || 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Address</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                      Street Address
                    </label>
                    <div className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {user.address || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <div className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {user.city || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <div className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {user.country || 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
