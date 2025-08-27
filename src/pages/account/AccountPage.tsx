
import React from 'react';
import { useUser } from '../../contexts/UserContext';
import { User, Calendar, CreditCard, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AccountPage: React.FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">You need to be logged in to view this page</p>
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-8 text-white">
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
          </div>

          {/* Account Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {[
                { id: 'profile', name: 'Profile', icon: User },
                { id: 'bookings', name: 'My Bookings', icon: Calendar },
                { id: 'payments', name: 'Payments', icon: CreditCard },
                { id: 'settings', name: 'Settings', icon: Settings },
              ].map((tab) => (
                <Link
                  key={tab.id}
                  to={`/account/${tab.id}`}
                  className="whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Account Content */}
          <div className="p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    {user.firstName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <div className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    {user.lastName}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    {user.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">No recent activity</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
