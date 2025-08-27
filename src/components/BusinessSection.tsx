import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Users, Calendar, Settings } from 'lucide-react';

const BusinessSection: React.FC = () => {
  return (
    <section id="business" className="py-20 bg-indigo-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">For Business Owners</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join our platform to showcase your hospitality business, manage bookings, and grow your customer base.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <Building className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Business Profile</h3>
            <p className="text-gray-600 text-center">
              Create and manage your business profile to showcase your services and attract customers.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <Calendar className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Booking Management</h3>
            <p className="text-gray-600 text-center">
              Easily manage your bookings, view customer details, and track your business performance.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Staff Management</h3>
            <p className="text-gray-600 text-center">
              Add and manage your staff members, assign roles, and coordinate schedules.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <Settings className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Business Settings</h3>
            <p className="text-gray-600 text-center">
              Customize your business settings, manage notifications, and control your privacy.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/business/register"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Register Your Business
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BusinessSection; 