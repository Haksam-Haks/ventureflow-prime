import React from 'react';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const UnauthorizedPage: React.FC = () => {
  return (
    <>
      <Toaster position="top-right" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
          <p className="text-gray-700 mb-6">You do not have permission to view this page.</p>
          <Link to="/" className="text-green-600 hover:underline font-medium">Go to Home</Link>
        </div>
      </div>
    </>
  );
};

export default UnauthorizedPage;
