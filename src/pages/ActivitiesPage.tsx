import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Search, Mountain, Bike, Waves, Castle } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const ActivitiesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [activityType, setActivityType] = useState<string>('all');
  const [showNoActivitiesToast, setShowNoActivitiesToast] = useState(false);

  // Sample activities data - in a real app, this would come from an API
  const activities = [
    {
      id: 1,
      name: 'Mountain Hiking',
      type: 'Adventure',
      rating: 4.8,
      location: 'Alpine Mountains',
      price: 120,
      duration: '6 hours',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      features: ['Guided Tour', 'Equipment Included', 'Scenic Views', 'All Levels'],
      description: 'Guided tours through scenic mountain trails with breathtaking views and professional guides.',
      icon: Mountain
    },
    {
      id: 2,
      name: 'Bike Tours',
      type: 'Exploration',
      rating: 4.5,
      location: 'Countryside',
      price: 85,
      duration: '4 hours',
      image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      features: ['Bike Rental', 'Local Guide', 'Refreshments', 'Family Friendly'],
      description: 'Explore the picturesque countryside on two wheels with our experienced local guides.',
      icon: Bike
    },
    {
      id: 3,
      name: 'Water Sports',
      type: 'Adventure',
      rating: 4.7,
      location: 'Beachfront',
      price: 150,
      duration: '3 hours',
      image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      features: ['Kayaking', 'Snorkeling', 'Paddleboarding', 'Instructor'],
      description: 'Experience thrilling water activities including kayaking, snorkeling, and paddleboarding.',
      icon: Waves
    },
    {
      id: 4,
      name: 'Cultural Tours',
      type: 'Cultural',
      rating: 4.6,
      location: 'Historic District',
      price: 75,
      duration: '5 hours',
      image: 'https://images.unsplash.com/photo-1570168308580-7cd3bf5c9076?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      features: ['Museum Access', 'Expert Guide', 'Local Cuisine', 'Small Groups'],
      description: 'Dive into local history and culture with visits to museums, landmarks, and historical sites.',
      icon: Castle
    },
    {
      id: 5,
      name: 'Safari Adventure',
      type: 'Wildlife',
      rating: 4.9,
      location: 'Nature Reserve',
      price: 220,
      duration: '8 hours',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1468&q=80',
      features: ['Wildlife Viewing', '4x4 Transport', 'Expert Rangers', 'Meals Included'],
      description: 'Experience wildlife up close in their natural habitat with our expert safari guides.',
      icon: Mountain
    },
    {
      id: 6,
      name: 'Cooking Class',
      type: 'Cultural',
      rating: 4.8,
      location: 'Downtown',
      price: 95,
      duration: '3 hours',
      image: 'https://images.unsplash.com/photo-1540648639573-8c848de23f0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
      features: ['Ingredients Included', 'Take-Home Recipes', 'Wine Pairing', 'Small Class Size'],
      description: 'Learn to prepare local delicacies with our expert chefs in an intimate, hands-on setting.',
      icon: Castle
    }
  ];

  // Filter activities based on search term and filters
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = searchTerm === '' || 
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = activity.price >= priceRange[0] && activity.price <= priceRange[1];

    const matchesType = activityType === 'all' || 
      activity.type.toLowerCase() === activityType.toLowerCase();
    
    return matchesSearch && matchesPrice && matchesType;
  });

  const handleBookActivity = (activityName: string) => {
    toast.success(`You booked: ${activityName}`);
  };

  React.useEffect(() => {
    if (filteredActivities.length === 0 && !showNoActivitiesToast) {
      toast.error("No activities found. Try adjusting your search criteria or filters.");
      setShowNoActivitiesToast(true);
    } else if (filteredActivities.length > 0 && showNoActivitiesToast) {
      setShowNoActivitiesToast(false);
    }
  }, [filteredActivities.length, showNoActivitiesToast]);

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Activities & Experiences</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover exciting activities to enhance your stay
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Activities
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Activity name or location"
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
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
                  className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="0-500">Any Price</option>
                  <option value="0-50">Budget (Under $50)</option>
                  <option value="50-100">Standard ($50 - $100)</option>
                  <option value="100-200">Premium ($100 - $200)</option>
                  <option value="200-500">Luxury ($200+)</option>
                </select>
              </div>

              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Type
                </label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Types</option>
                  <option value="adventure">Adventure</option>
                  <option value="cultural">Cultural</option>
                  <option value="exploration">Exploration</option>
                  <option value="wildlife">Wildlife</option>
                </select>
              </div>

              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Activities Grid */}
          {filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-60">
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{activity.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">{activity.name}</h3>
                      <p className="font-bold text-green-600">${activity.price}</p>
                    </div>
                    <div className="flex items-center mt-2 text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{activity.location}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span>{activity.duration}</span>
                    </div>
                    <p className="mt-3 text-gray-600 line-clamp-2">{activity.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {activity.features.slice(0, 3).map((feature, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {activity.features.length > 3 && (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          +{activity.features.length - 3} more
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/activities/${activity.id}`}
                      className="mt-6 block w-full bg-green-600 hover:bg-green-700 text-white text-center px-4 py-2 rounded-md transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleBookActivity(activity.name)}
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-md transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Mountain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters to find more options
              </p>
            </div>
          )}

          {/* Featured Experiences */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Family Package",
                  discount: "20% OFF",
                  description: "Special discount for family bookings of 4 or more",
                  color: "bg-gradient-to-r from-green-500 to-green-600"
                },
                {
                  title: "Early Bird Special",
                  discount: "15% OFF",
                  description: "Book activities at least 7 days in advance",
                  color: "bg-gradient-to-r from-blue-500 to-blue-600"
                },
                {
                  title: "Adventure Bundle",
                  discount: "25% OFF",
                  description: "Book 3 or more adventure activities together",
                  color: "bg-gradient-to-r from-purple-500 to-purple-600"
                }
              ].map((deal, index) => (
                <div
                  key={index}
                  className={`${deal.color} text-white rounded-lg shadow-md p-6 flex flex-col justify-between`}
                >
                  <div>
                    <h3 className="text-xl font-bold mb-2">{deal.title}</h3>
                    <p className="mb-4">{deal.description}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{deal.discount}</span>
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
    </>
  );
};

export default ActivitiesPage;
