
import React from 'react';
import { Camera, Bird, Trees } from 'lucide-react';

const WildlifeTours: React.FC = () => {
  const tours = [
    {
      id: 1,
      name: 'Morning Safari',
      description: 'Spot wildlife at their most active time of day',
      duration: '3 hours',
      icon: Camera
    },
    {
      id: 2,
      name: 'Bird Watching',
      description: 'Guided tour to observe rare bird species',
      duration: '2 hours',
      icon: Bird
    },
    {
      id: 3,
      name: 'Nature Walk',
      description: 'Leisurely hike through diverse ecosystems',
      duration: '4 hours',
      icon: Trees
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Wildlife Tours</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Immerse yourself in nature with our expert-guided experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4">
                  <tour.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{tour.name}</h3>
                <p className="text-gray-600 mb-4">{tour.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{tour.duration}</span>
                  <button className="text-sm font-medium text-green-600 hover:text-green-700">
                    Book Now →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Private Tours Available</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Customize your wildlife experience with a private guide tailored to your interests
            </p>
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
              Enquire About Private Tours
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WildlifeTours;
