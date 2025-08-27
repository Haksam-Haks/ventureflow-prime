
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Utensils, Menu, Users, Coffee } from 'lucide-react';

// Mock restaurant data - in a real app, this would come from an API
const restaurantsData = [
  {
    id: "1",
    name: 'Oceanview Grill',
    cuisine: 'Seafood, International',
    rating: 4.5,
    location: 'Beachfront',
    description: 'Elegant seafood restaurant with panoramic ocean views and daily fresh catch. Our executive chef creates innovative dishes with the freshest ingredients.',
    priceRange: '$$$',
    openingHours: '12:00 PM - 11:00 PM',
    features: [
      { name: 'Outdoor Seating', icon: Coffee },
      { name: 'Wine Selection', icon: Coffee },
      { name: 'Ocean View', icon: Coffee }
    ],
    menuCategories: [
      { 
        name: 'Starters', 
        items: [
          { name: 'Fresh Oysters', price: 24, description: 'Half dozen fresh local oysters with mignonette' },
          { name: 'Tuna Tartare', price: 18, description: 'Fresh tuna with avocado and citrus' },
          { name: 'Crab Cakes', price: 20, description: 'Lump crab meat with remoulade sauce' }
        ] 
      },
      { 
        name: 'Main Courses', 
        items: [
          { name: 'Grilled Sea Bass', price: 38, description: 'Served with seasonal vegetables and herb butter' },
          { name: 'Lobster Risotto', price: 42, description: 'Creamy risotto with fresh lobster and parmesan' },
          { name: 'Filet Mignon', price: 45, description: '8oz grass-fed beef with truffle mashed potatoes' }
        ] 
      }
    ],
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: "2",
    name: 'Mountain Bistro',
    cuisine: 'Local, Organic',
    rating: 4.2,
    location: 'Main Resort',
    description: 'Cozy bistro serving organic, locally-sourced cuisine and regional specialties. Our menu changes seasonally to reflect the freshest available ingredients.',
    priceRange: '$$',
    openingHours: '7:00 AM - 10:00 PM',
    features: [
      { name: 'Farm-to-Table', icon: Coffee },
      { name: 'Vegetarian Options', icon: Coffee },
      { name: 'Local Wines', icon: Utensils }
    ],
    menuCategories: [
      { 
        name: 'Breakfast', 
        items: [
          { name: 'Mountain Omelet', price: 16, description: 'Free-range eggs with local cheese and vegetables' },
          { name: 'Brioche French Toast', price: 14, description: 'With maple syrup and seasonal berries' },
          { name: 'Granola Bowl', price: 12, description: 'Housemade granola with yogurt and honey' }
        ] 
      },
      { 
        name: 'Dinner', 
        items: [
          { name: 'Alpine Lamb', price: 32, description: 'Slow-roasted with herbs and root vegetables' },
          { name: 'Mushroom Risotto', price: 24, description: 'With foraged wild mushrooms and truffle oil' },
          { name: 'Roast Chicken', price: 28, description: 'Free-range chicken with garlic and herbs' }
        ] 
      }
    ],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: "3",
    name: 'Sunset Lounge',
    cuisine: 'Tapas, Cocktails',
    rating: 4.7,
    location: 'Rooftop',
    description: 'Sophisticated rooftop lounge offering craft cocktails and tapas with stunning sunset views. Our mixologists create signature drinks with premium spirits.',
    priceRange: '$$$',
    openingHours: '4:00 PM - 1:00 AM',
    features: [
      { name: 'Signature Cocktails', icon: Coffee },
      { name: 'Live Music', icon: Coffee },
      { name: 'Sunset Views', icon: Utensils }
    ],
    menuCategories: [
      { 
        name: 'Tapas', 
        items: [
          { name: 'Patatas Bravas', price: 12, description: 'Crispy potatoes with spicy tomato sauce' },
          { name: 'Gambas al Ajillo', price: 18, description: 'Garlic shrimp with chili and olive oil' },
          { name: 'Jamon Iberico', price: 22, description: 'Premium Spanish ham with toast points' }
        ] 
      },
      { 
        name: 'Cocktails', 
        items: [
          { name: 'Sunset Spritz', price: 16, description: 'Aperol, prosecco, orange and elderflower' },
          { name: 'Smoky Mezcalita', price: 18, description: 'Mezcal, lime, agave and chili rim' },
          { name: 'Lavender Gin Fizz', price: 17, description: 'Gin, lavender syrup, lemon and soda' }
        ] 
      }
    ],
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  }
];

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Available time slots for reservation
  const timeSlots = ['11:30 AM', '12:00 PM', '1:00 PM', '5:30 PM', '6:00 PM', '7:00 PM', '8:00 PM'];

  useEffect(() => {
    // Simulate API fetch with timeout
    setLoading(true);
    setTimeout(() => {
      const foundRestaurant = restaurantsData.find(r => r.id === id);
      
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
        setError(null);
      } else {
        setError("Restaurant not found");
      }
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the restaurant you were looking for.</p>
          <Link 
            to="/restaurants" 
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
          >
            Return to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Restaurant Header */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-gray-700">{restaurant.rating}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-700">{restaurant.cuisine}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="ml-1 text-gray-500">{restaurant.location}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center">
                <span className="text-lg font-semibold text-orange-600 mr-2">{restaurant.priceRange}</span>
                <div className="flex items-center text-gray-500">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{restaurant.openingHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="bg-gray-200 h-64 sm:h-96 w-full">
            <img 
              src={restaurant.image} 
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About this restaurant</h2>
                <p className="text-gray-600 mb-6">{restaurant.description}</p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {restaurant.features.map((feature: any, index: number) => (
                    <div key={index} className="flex items-center">
                      <feature.icon className="h-5 w-5 text-orange-500 mr-2" />
                      <span className="text-gray-700">{feature.name}</span>
                    </div>
                  ))}
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8 flex items-center">
                  <Menu className="h-5 w-5 mr-2 text-orange-500" />
                  Menu Highlights
                </h2>
                
                {restaurant.menuCategories.map((category: any, idx: number) => (
                  <div key={idx} className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">{category.name}</h3>
                    <div className="space-y-4">
                      {category.items.map((item: any, itemIdx: number) => (
                        <div key={itemIdx} className="border-b border-gray-200 pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            </div>
                            <span className="text-orange-600 font-medium">${item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column - Reservation */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Make a Reservation</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Date
                      </label>
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        defaultValue={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Guests
                      </label>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-2" />
                        <select 
                          value={guests} 
                          onChange={(e) => setGuests(Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'guest' : 'guests'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Available Time Slots
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedTimeSlot(time)}
                            className={`py-2 text-sm font-medium rounded ${
                              selectedTimeSlot === time
                                ? 'bg-orange-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <Link
                      to={`/booking/restaurant/${id}?guests=${guests}&time=${selectedTimeSlot}`}
                      className={`mt-4 block text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        selectedTimeSlot 
                          ? 'bg-orange-600 hover:bg-orange-700' 
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Complete Reservation
                    </Link>
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

export default RestaurantDetailPage;
