
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Search, Utensils, Coffee, UserCircle } from 'lucide-react';

const RestaurantListing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [cuisineType, setCuisineType] = useState<string>('all');

  // Sample restaurant data - in a real app, this would come from an API
  const restaurants = [
    {
      id: 1,
      name: 'Oceanview Grill',
      cuisine: 'Seafood, International',
      rating: 4.5,
      location: 'Beachfront',
      priceRange: '$$$',
      price: 120,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      amenities: ['Ocean View', 'Fresh Catch', 'Wine Pairing', 'Outdoor Seating'],
      description: 'Elegant seafood restaurant with panoramic ocean views and daily fresh catch.'
    },
    {
      id: 2,
      name: 'Mountain Bistro',
      cuisine: 'Local, Organic',
      rating: 4.2,
      location: 'Main Resort',
      priceRange: '$$',
      price: 80,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      amenities: ['Farm-to-Table', 'Vegetarian Options', 'Local Wines', 'Cozy Ambiance'],
      description: 'Cozy bistro serving organic, locally-sourced cuisine and regional specialties.'
    },
    {
      id: 3,
      name: 'Sunset Lounge',
      cuisine: 'Tapas, Cocktails',
      rating: 4.7,
      location: 'Rooftop',
      priceRange: '$$$',
      price: 150,
      image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      amenities: ['Signature Cocktails', 'Live Music', 'Sunset Views', 'Premium Spirits'],
      description: 'Sophisticated rooftop lounge offering craft cocktails and tapas with stunning sunset views.'
    },
    {
      id: 4,
      name: 'Urban Table',
      cuisine: 'Contemporary, Fusion',
      rating: 4.4,
      location: 'Downtown',
      priceRange: '$$',
      price: 95,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      amenities: ['Chef Tasting Menu', 'Wine Cellar', 'Open Kitchen', 'Private Dining'],
      description: 'Modern restaurant serving creative fusion dishes in a stylish urban setting.'
    },
    {
      id: 5,
      name: 'Garden Terrace',
      cuisine: 'Mediterranean, Vegan',
      rating: 4.6,
      location: 'Garden Plaza',
      priceRange: '$$',
      price: 85,
      image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      amenities: ['Garden Seating', 'Plant-Based Menu', 'Organic Wines', 'Family Style'],
      description: 'Vibrant restaurant specializing in Mediterranean cuisine with plenty of vegan options.'
    },
    {
      id: 6,
      name: 'Sake House',
      cuisine: 'Japanese, Sushi',
      rating: 4.8,
      location: 'Waterfront',
      priceRange: '$$$$',
      price: 200,
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      amenities: ['Omakase Experience', 'Sake Tasting', 'Fresh Sushi Bar', 'Tatami Rooms'],
      description: 'Authentic Japanese restaurant with master sushi chefs and premium sake selection.'
    },
  ];

  // Filter restaurants based on search term and filters
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = searchTerm === '' || 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = restaurant.price >= priceRange[0] && restaurant.price <= priceRange[1];

    const matchesCuisine = cuisineType === 'all' || 
      restaurant.cuisine.toLowerCase().includes(cuisineType.toLowerCase());
    
    return matchesSearch && matchesPrice && matchesCuisine;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Fine Dining</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our curated selection of exceptional dining establishments
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Restaurants
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Restaurant name, cuisine or location"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <select
                value={`${priceRange[0]}-${priceRange[1]}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-').map(Number);
                  setPriceRange([min, max]);
                }}
                className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="0-500">Any Price</option>
                <option value="0-50">$ (Under $50)</option>
                <option value="50-100">$$ ($50 - $100)</option>
                <option value="100-200">$$$ ($100 - $200)</option>
                <option value="200-500">$$$$ ($200+)</option>
              </select>
            </div>

            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuisine
              </label>
              <select
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Cuisines</option>
                <option value="seafood">Seafood</option>
                <option value="local">Local</option>
                <option value="tapas">Tapas</option>
                <option value="japanese">Japanese</option>
                <option value="mediterranean">Mediterranean</option>
              </select>
            </div>

            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Restaurants Grid */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-60">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">{restaurant.name}</h3>
                    <p className="font-bold text-orange-600">{restaurant.priceRange}</p>
                  </div>
                  <div className="flex items-center mt-2 text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{restaurant.location}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span>{restaurant.cuisine}</span>
                  </div>
                  <p className="mt-3 text-gray-600 line-clamp-2">{restaurant.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {restaurant.amenities.slice(0, 3).map((amenity, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                    {restaurant.amenities.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{restaurant.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/restaurants/${restaurant.id}`}
                    className="mt-6 block w-full bg-orange-600 hover:bg-orange-700 text-white text-center px-4 py-2 rounded-md transition-colors"
                  >
                    View Menu & Reservations
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Utensils className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters to find more options
            </p>
          </div>
        )}

        {/* Special Offers */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Special Dining Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Chef's Tasting Menu",
                discount: "15% OFF",
                description: "Experience our premium tasting menu with wine pairing",
                color: "bg-gradient-to-r from-orange-500 to-orange-600"
              },
              {
                title: "Weekend Brunch",
                discount: "Free Mimosa",
                description: "Complimentary mimosa with any brunch entrée",
                color: "bg-gradient-to-r from-yellow-500 to-yellow-600"
              },
              {
                title: "Date Night Special",
                discount: "25% OFF",
                description: "For couples dining Tuesday and Wednesday evenings",
                color: "bg-gradient-to-r from-red-500 to-red-600"
              }
            ].map((offer, index) => (
              <div
                key={index}
                className={`${offer.color} text-white rounded-lg shadow-md p-6 flex flex-col justify-between`}
              >
                <div>
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <p className="mb-4">{offer.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{offer.discount}</span>
                  <button className="bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-100 transition-colors">
                    View Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantListing;
