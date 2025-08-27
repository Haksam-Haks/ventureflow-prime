import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';
import { Toaster } from "react-hot-toast";

const DestinationsPage: React.FC = () => {
  // Sample destination data - in a real app this would come from an API
  const destinations = [
    {
      id: 1,
      name: 'Paris',
      country: 'France',
      description: 'The City of Light offers iconic landmarks, exquisite cuisine, and romantic charm.',
      image: 'https://images.pexels.com/photos/4825701/pexels-photo-4825701.jpeg',
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral'],
      hotels: 128,
      restaurants: 354
    },
    {
      id: 2,
      name: 'Maldives',
      country: 'Maldives',
      description: 'Paradise islands with overwater bungalows, crystal-clear waters, and pristine beaches.',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      highlights: ['Overwater Villas', 'Coral Reefs', 'Dolphin Watching'],
      hotels: 87,
      restaurants: 112
    },
    {
      id: 3,
      name: 'New York',
      country: 'USA',
      description: 'The Big Apple features skyscrapers, world-class museums, and a vibrant culture.',
      image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',
      highlights: ['Times Square', 'Central Park', 'Empire State Building'],
      hotels: 432,
      restaurants: 986
    },
    {
      id: 4,
      name: 'Tokyo',
      country: 'Japan',
      description: 'A fascinating blend of ultramodern and traditional, with amazing food and culture.',
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg',
      highlights: ['Shibuya Crossing', 'Mount Fuji', 'Tokyo Skytree'],
      hotels: 312,
      restaurants: 678
    },
    {
      id: 5,
      name: 'Santorini',
      country: 'Greece',
      description: 'Famous for its stunning sunsets, white-washed buildings, and blue domed churches.',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff',
      highlights: ['Oia Village', 'Caldera Views', 'Black Sand Beaches'],
      hotels: 94,
      restaurants: 156
    },
    {
      id: 6,
      name: 'Bali',
      country: 'Indonesia',
      description: 'A tropical paradise with beautiful temples, rice terraces, and surf beaches.',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
      highlights: ['Ubud Monkey Forest', 'Rice Terraces', 'Uluwatu Temple'],
      hotels: 245,
      restaurants: 387
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Popular Destinations</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our handpicked destinations around the world and start planning your next adventure
            </p>
          </div>

          {/* Featured destinations grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {destinations.map((destination) => (
              <div 
                key={destination.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-56 relative overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-5 w-full">
                      <div className="flex justify-between items-end">
                        <div>
                          <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                          <div className="flex items-center text-white/90">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{destination.country}</span>
                          </div>
                        </div>
                        <Link 
                          to={`/destinations/${destination.id}`}
                          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-2 rounded-full transition-colors"
                        >
                          <ChevronRight className="h-5 w-5 text-white" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.highlights.map((highlight, idx) => (
                      <span 
                        key={idx} 
                        className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                    <span>{destination.hotels} Hotels</span>
                    <span>{destination.restaurants} Restaurants</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore Destinations on the Map</h2>
              <p className="text-gray-600 mb-6">Find the perfect location for your next adventure</p>
              <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Interactive map would be displayed here</p>
              </div>
            </div>
          </div>

          {/* Travel Guides */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Travel Guides</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Expert advice to help you plan the perfect trip</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: "Ultimate Paris Guide",
                image: "https://images.pexels.com/photos/4825701/pexels-photo-4825701.jpeg",
                excerpt: "Everything you need to know about visiting the City of Light"
              },
              {
                title: "Bali on a Budget",
                image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
                excerpt: "How to experience paradise without breaking the bank"
              },
              {
                title: "New York City Insider Tips",
                image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
                excerpt: "Local secrets for making the most of your NYC trip"
              }
            ].map((guide, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="h-48 overflow-hidden">
                  <img src={guide.image} alt={guide.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-gray-600 mb-4">{guide.excerpt}</p>
                  <Link
                    to="#"
                    className="text-green-600 font-medium hover:text-green-700 flex items-center"
                  >
                    Read more
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-12 md:py-16 md:px-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Get Travel Inspiration</h2>
              <p className="max-w-2xl mx-auto mb-8">
                Subscribe to our newsletter and receive exclusive offers, travel tips, and destination guides
              </p>
              <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
                />
                <button className="bg-white text-green-600 hover:bg-gray-100 font-medium px-6 py-3 rounded-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DestinationsPage;
