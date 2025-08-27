import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useBusiness } from '../contexts/BusinessContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, LogOut, Calendar, Star, MapPin, Search, Globe, CreditCard, Headphones,
  MapPin as LocationIcon, Clock, Shield, Award,
  Users, Heart, MessageCircle, Smartphone, ChevronRight, Menu, X,
  Home, Building, TreePine, Waves, Mountain, Utensils, 
  Zap, CheckCircle, Play, 
  Bed} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import apiService from '../services/apiService';
import { useToast } from '../hooks/use-toast';
const logo = import.meta.env.BASE_URL + 'logo/egret other-04.png';

const Index: React.FC = () => {
  const { dispatch } = useBusiness();
  const [hotels, setHotels] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHotels, setFilteredHotels] = useState<any[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [destination, setDestination] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [] = useState('stays');
  const [guests, setGuests] = useState('2 guests');
  const [] = useState('1 room');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currency] = useState('UGX');
  const [notifications] = useState(3);
  const [] = useState('');
  const [] = useState('');

  // Navbar logic
  const { user, logout } = useUser();
  const navigate = useNavigate();
  useToast();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
      setIsUserMenuOpen(false);
    }
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleLogout = useCallback(async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/login');
  }, [logout, navigate]);

  const getUserInitials = useCallback((firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return '';
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }, []);

  // Data loading from API
  useEffect(() => {
    const fetchHotelsAndRestaurants = async () => {
      try {
        setIsLoading(true);
        const response = await apiService().sendPostToServerWithOutToken('businesses/getproperties', {});
        if (response.status === 200 && Array.isArray(response.data)) {
          setHotels(response.data.slice(0, 8));
          setFilteredHotels(response.data.slice(0, 8));
          setRestaurants(response.data.slice(0, 8));
          setFilteredRestaurants(response.data.slice(0, 8));
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setHotels([]);
        setFilteredHotels([]);
        setRestaurants([]);
        setFilteredRestaurants([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotelsAndRestaurants();
  }, []);

  // Search filtering
  useEffect(() => {
    if (!searchTerm) {
      setFilteredHotels(hotels);
      setFilteredRestaurants(restaurants);
    } else {
      setFilteredHotels(
        hotels.filter(h =>
          h.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          h.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          h.location?.country?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredRestaurants(
        restaurants.filter(r =>
          r.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.location?.country?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, hotels, restaurants]);

  // Sample data from original code
  const destinations = [
    {
      name: 'Kampala',
      description: 'The vibrant capital city',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
      path: '/destinations/kampala',
      properties: 145,
      attractions: 'Museums, Markets, Nightlife',
      icon: Building,
      isPopular: true
    },
    {
      name: 'Jinja',
      description: 'Adventure capital',
      imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      path: '/destinations/jinja',
      properties: 89,
      attractions: 'Nile River, Waterfalls',
      icon: Waves,
      isPopular: true
    },
    {
      name: 'Entebbe',
      description: 'Lakeside charm',
      imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      path: '/destinations/entebbe',
      properties: 156,
      attractions: 'Beaches, Botanical Gardens',
      icon: TreePine,
      isPopular: false
    },
    {
      name: 'Murchison Falls',
      description: 'Wildlife paradise',
      imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      path: '/destinations/murchison-falls',
      properties: 23,
      attractions: 'Safari, Waterfalls',
      icon: Mountain,
      isPopular: true
    }
  ];

  const propertyTypes = [
    { name: 'Hotels', icon: Bed, count: 150, description: 'Luxury to budget options', path: '/hotels' },
    { name: 'Apartments', icon: Home, count: 120, description: 'Home away from home', path: '/apartments' },
    { name: 'Resorts', icon: Waves, count: 80, description: 'Relaxation destinations', path: '/resorts' },
    { name: 'Villas', icon: TreePine, count: 45, description: 'Private luxury stays', path: '/villas' },
    { name: 'Lodges', icon: Mountain, count: 65, description: 'Nature retreats', path: '/lodges' }
  ];

  const experiences = [
    {
      id: 1,
      title: 'Gorilla Trekking Adventure',
      location: 'Bwindi Impenetrable Forest',
      duration: '1 Day',
      price: 650000,
      imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&q=80',
      rating: 4.9,
      reviews: 156,
      category: 'Wildlife',
      path: '/experiences/gorilla-trekking'
    },
    {
      id: 2,
      title: 'Nile Whitewater Rafting',
      location: 'Jinja',
      duration: '1 Day',
      price: 250000,
      imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&q=80',
      rating: 4.7,
      reviews: 234,
      category: 'Adventure',
      path: '/experiences/nile-rafting'
    },
    {
      id: 3,
      title: 'Kampala City Tour',
      location: 'Kampala',
      duration: 'Half Day',
      price: 120000,
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
      rating: 4.5,
      reviews: 189,
      category: 'Cultural',
      path: '/experiences/kampala-tour'
    },
    {
      id: 4,
      title: 'Sipi Falls Hike',
      location: 'Kapchorwa',
      duration: '1 Day',
      price: 180000,
      imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&q=80',
      rating: 4.8,
      reviews: 112,
      category: 'Nature',
      path: '/experiences/sipi-falls'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'United Kingdom',
      rating: 5,
      comment: 'Absolutely incredible experience! The gorilla trekking was once-in-a-lifetime, and the accommodation exceeded expectations.',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b277?w=100&q=80',
      verified: true
    },
    {
      id: 2,
      name: 'Michael Brown',
      location: 'United States',
      rating: 5,
      comment: 'The team at Egret Hospitality made our trip seamless. From airport pickup to accommodations, everything was perfect.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      verified: true
    },
    {
      id: 3,
      name: 'Amina Nalwoga',
      location: 'Uganda',
      rating: 4,
      comment: 'Great service and excellent recommendations for local experiences. Will definitely use them again for my next trip.',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      verified: false
    }
  ];

  const travelStats = [
    { label: 'Happy Travelers', value: '50,000+', icon: Users },
    { label: 'Verified Properties', value: '2,500+', icon: CheckCircle },
    { label: 'Destinations', value: '120+', icon: MapPin },
    { label: 'Support Available', value: '24/7', icon: Headphones }
  ];

  const specialOffers = [
    {
      id: 1,
      title: 'Early Bird Special',
      description: 'Book 30 days in advance and save up to 25%',
      discount: 25,
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      path: '/deals/early-bird'
    },
    {
      id: 2,
      title: 'Last Minute Deals',
      description: 'Great discounts on last-minute bookings',
      discount: 30,
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      path: '/deals/last-minute'
    },
    {
      id: 3,
      title: 'Long Stay Discount',
      description: 'Stay 7+ nights and get 15% off',
      discount: 15,
      icon: Bed,
      color: 'from-green-500 to-teal-500',
      path: '/deals/long-stay'
    }
  ];
  // Components
  const SkeletonCard = () => (
    <div className="bg-gray-200 rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="bg-gray-300 h-48 w-full"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  );

  const PropertyCard = ({ property, type }: { property: any, type: 'hotel' | 'restaurant' }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-blue-300 border border-transparent group cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={property.photos?.[0]?.url || 
               (type === 'hotel' ? 
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' : 
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')} 
          alt={property.propertyName} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-white/90 text-yellow-600 px-2 py-1 rounded-md text-xs font-semibold flex items-center">
          <Star className="w-3 h-3 fill-current mr-1" />
          {property.rating || '4.5'}
        </div>
        <button className="absolute top-2 left-2 bg-white/90 hover:bg-white text-gray-600 p-1.5 rounded-full transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{property.propertyName}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{property.location?.city || 'Uganda'}</span>
        </div>
        {type === 'hotel' ? (
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-500">From</span>
            <div className="text-right">
              <span className="font-bold text-gray-900">{currency} {property.price?.toLocaleString() || '150,000'}</span>
              <span className="block text-xs text-gray-500">per night</span>
            </div>
          </div>
        ) : (
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {property.cuisine || property.businessType || 'International'}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const DestinationCard = ({ name, description, imageUrl, path, properties }: { 
    name: string, 
    description: string, 
    imageUrl: string,
    path: string,
    properties: number
  }) => (
    <Link to={path} className="group relative rounded-lg overflow-hidden h-64">
      <img 
        src={imageUrl} 
        alt={name} 
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-gray-200 text-sm mb-1">{description}</p>
        <p className="text-gray-300 text-xs">{properties} properties</p>
      </div>
    </Link>
  );

  // ExperienceCard component
  const ExperienceCard = ({ experience }: { experience: any }) => (
    <Link to={experience.path} className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-blue-300 border border-transparent cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img
          src={experience.imageUrl}
          alt={experience.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-white/90 text-yellow-600 px-2 py-1 rounded-md text-xs font-semibold flex items-center">
          <Star className="w-3 h-3 fill-current mr-1" />
          {experience.rating}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{experience.title}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{experience.location}</span>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-gray-500">From</span>
          <div className="text-right">
            <span className="font-bold text-gray-900">{currency} {experience.price?.toLocaleString() || '0'}</span>
            <span className="block text-xs text-gray-500">{experience.duration}</span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="overflow-x-hidden">
      {/* Navbar Section */}
      <section>
  <div className="w-full max-w-5xl mx-auto flex flex-row items-center justify-between gap-4 px-6 py-4 absolute top-0 left-0 right-0 z-50 bg-transparent shadow-none border-none">
    {/* Logo on the left */}
    <div className="flex items-center">
      <Link to="/" className="focus:outline-none group" aria-label="Home">
        <img
          src={logo}
          alt="Egret Hospitality Logo"
          className="h-14 w-auto transition-all duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/fallback-logo.png';
          }}
          loading="lazy"
        />
      </Link>
    </div>
    {/* Right side: navigation, user, etc. */}
    <div className="flex flex-row items-center gap-6">
      {/* Business Owner/Staff: Add Business Units */}
      {(user && (user.role === 'BUSINESS_OWNER' || user.role === 'BUSINESS_STAFF')) && (
        <button
          className="text-sm font-medium text-white hover:text-primary transition-colors duration-200 px-3 py-1.5"
          onClick={async () => {
            try {
              const response = await apiService().sendGetToServer(`admin/getBusinessTypeForUser/${user.id}`);
              let businessTypeId = null;
              const res = response as any;
              if (res?.data?.id) {
                businessTypeId = res.data.id;
              } else if (res?.returnObject?.id) {
                businessTypeId = res.returnObject.id;
              } else if (res?.data?.data?.id) {
                businessTypeId = res.data.data.id;
              }
              if (businessTypeId) {
                dispatch({ type: 'SET_CATEGORY', categoryId: businessTypeId });
                navigate(`/dashboard/${businessTypeId}`);
              } else {
                navigate('/');
              }
            } catch (error) {
              console.error('Error navigating to dashboard:', error);
              navigate('/');
            }
          }}
        >
          Add Business Units
        </button>
      )}
      {/* Admin: Admin Panel */}
      {user?.role === 'ADMIN' && (
        <Link
          to="/admin"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 px-3 py-1.5"
        >
          Admin Panel
        </Link>
      )}
      {/* Business: My Businesses/Add Listing */}
      {user?.isBusiness && (
        <>
          <Link
            to="/business/ListOfProperty"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 px-3 py-1.5"
          >
            My Businesses
          </Link>
          <Link
            to="/business/CreateProperty"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 px-3 py-1.5"
          >
            Add Listing
          </Link>
        </>
      )}
      {/* Right side - Currency, Language, User menu */}
      <div className="flex items-center space-x-4">
        {/* Admin: Admin Panel */}
        {user?.role === 'ADMIN' && (
          <Link
            to="/admin"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 px-3 py-1.5"
          >
            Admin Panel
          </Link>
        )}
        {/* Business: My Businesses/Add Listing */}
        {user?.isBusiness && (
          <>
            <Link
              to="/business/ListOfProperty"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 px-3 py-1.5"
            >
              My Businesses
            </Link>
            <Link
              to="/business/CreateProperty"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 px-3 py-1.5"
            >
              Add Listing
            </Link>
          </>
        )}
        {/* Language Selector */}
        <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1">
          <Globe className="w-4 h-4" />
          <span>EN</span>
        </button>
        {/* User Menu */}
        {user ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 focus:outline-none group"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] text-white flex items-center justify-center text-sm font-medium">
                  {getUserInitials(user.firstName, user.lastName)}
                </div>
                {notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </div>
                )}
              </div>
            </button>
            {/* navvvvvv bg */}
            {isUserMenuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-transparent ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Link
                  to="/account"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-3" />
                  My Profile
                </Link>
                <Link
                  to="/account/bookings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  My Bookings
                </Link>
                <Link
                  to="/account/wishlist"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Heart className="h-4 w-4 mr-3" />
                  Wishlist
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2"
            >
              Sign in
            </Link>
            <Link
              to="/business/register"
              className="bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        )}
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </div>
  </div>
</section>

      {/* Hero Section with Enhanced Search */}
      <section className="relative h-[80vh] min-h-[600px] bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover opacity-60"
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80"
          >
            <source src="https://www.w3schools.com/howto/rain.mp4" type="video/mp4" />
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80" 
              alt="Uganda landscape" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </video>
          <div className="absolute inset-0 bg-black/40" aria-hidden="true"></div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          {/* Personalized welcome for logged-in users */}
          {user && (
            <div className="mb-4 animate-fade-in">
              <p className="text-white/80 text-lg">Welcome back, {user.firstName}!</p>
            </div>
          )}

          <div className="max-w-4xl mx-auto mb-8 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white mb-6">
              Your next adventure starts here
            </h1>
            <p className="text-xl text-gray-200 mb-2">
              Discover amazing places to stay, unique experiences, and more
            </p>
            <div className="flex items-center justify-center space-x-4 text-white/80">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                <span className="text-sm">Best Price Guarantee</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1 text-green-400" />
                <span className="text-sm">Secure Booking</span>
              </div>
            </div>
          </div>

          {/* Enhanced Search Widget */}
          <div className="w-full max-w-6xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Tabs */}
         

              {/* Search Form */}
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Where</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Destination, property name, or address"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                      <LocationIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Check-in / Check-out</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Add dates"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                      />
                      <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Guests</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Add guests"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                      />
                      <Users className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                    <button className="w-full bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] text-white py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-all duration-200 flex items-center justify-center font-medium">
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </button>
                  </div>
                </div>

                {/* Quick Search Suggestions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500">Quick searches:</span>
                  {['Kampala', 'Jinja', 'Entebbe', 'Safari Lodges'].map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => setDestination(suggestion)}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End of Hero Section with Enhanced Search */}
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Personalized Dashboard Section (for logged-in users) */}
        {user && (
          <section className="mb-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-50 rounded-lg p-4 mb-2">
                    <Calendar className="w-8 h-8 text-blue-600 mx-auto" />
                  </div>
                  <h3 className="font-semibold text-gray-900">My Bookings</h3>
                  <p className="text-sm text-gray-500">2 upcoming trips</p>
                </div>
                <div className="text-center">
                  <div className="bg-pink-50 rounded-lg p-4 mb-2">
                    <Heart className="w-8 h-8 text-pink-600 mx-auto" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Wishlist</h3>
                  <p className="text-sm text-gray-500">15 saved places</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-50 rounded-lg p-4 mb-2">
                    <Award className="w-8 h-8 text-green-600 mx-auto" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Loyalty Points</h3>
                  <p className="text-sm text-gray-500">2,450 points</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-50 rounded-lg p-4 mb-2">
                    <MessageCircle className="w-8 h-8 text-purple-600 mx-auto" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Messages</h3>
                  <p className="text-sm text-gray-500">3 unread</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Flash Deals & Promotions */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl text-white p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 mr-2" />
                <h2 className="text-2xl font-bold">Flash Deals</h2>
              </div>
              <p className="text-lg mb-4">Limited time offers - up to 40% off selected properties!</p>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">12</div>
                  <div className="text-sm opacity-90">Hours</div>
                </div>
                <div className="text-2xl">:</div>
                <div className="text-center">
                  <div className="text-3xl font-bold">45</div>
                  <div className="text-sm opacity-90">Minutes</div>
                </div>
                <div className="text-2xl">:</div>
                <div className="text-center">
                  <div className="text-3xl font-bold">23</div>
                  <div className="text-sm opacity-90">Seconds</div>
                </div>
              </div>
              <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                View All Deals
              </button>
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Popular destinations</h2>
              <p className="text-gray-600 mt-1">Explore the most loved places by travelers</p>
            </div>
            <Link to="/destinations" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <DestinationCard
                key={destination.name}
                name={destination.name}
                description={destination.description}
                imageUrl={destination.imageUrl}
                path={destination.path}
                properties={destination.properties}
              />
            ))}
          </div>
        </section>

        {/* Featured Properties */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <Star className="w-8 h-8 text-yellow-500 mr-3" />
                Featured Properties
              </h2>
              <p className="text-gray-600 mt-1">Handpicked by our local experts</p>
            </div>
            <Link to="/hotels" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <>
                <div className="col-span-4 text-center py-12 text-gray-500">Loading top hotels...</div>
                {Array(4).fill(0).map((_, i) => <SkeletonCard key={`hotel-skeleton-${i}`} />)}
              </>
            ) : filteredHotels.length === 0 ? (
              <div className="col-span-4 text-center py-12">
                <div className="text-gray-500 mb-4 flex flex-col items-center">
                  <span className="text-3xl mb-2" role="img" aria-label="no hotels">😕</span>
                  No hotels found for your search.
                </div>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="font-medium flex items-center gap-1 bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] text-white px-3 py-1.5 rounded-md hover:opacity-90"
                >
                  Clear search <span aria-hidden>↻</span>
                </button>
              </div>
            ) : (
              filteredHotels
                .filter(hotel => hotel.location?.country?.toLowerCase() === 'uganda' || hotel.location?.country === undefined)
                .slice(0, 4)
                .map(hotel => (
                  <PropertyCard key={hotel.id} property={hotel} type="hotel" />
                ))
            )}
          </div>
        </section>

        {/* Unique Stays & Experiences */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Unique stays & experiences</h2>
              <p className="text-gray-600 mt-1">Discover extraordinary places and activities</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Large featured card */}
            <div className="lg:col-span-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl text-white p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Treehouse Adventures</h3>
                <p className="text-purple-100 mb-4">Sleep among the trees in our unique treehouses</p>
                <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Explore Treehouses
                </button>
              </div>
              <TreePine className="absolute bottom-4 right-4 w-16 h-16 text-white/20" />
            </div>

            {/* Smaller cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-blue-500 rounded-2xl text-white p-6 relative overflow-hidden">
                <h3 className="text-lg font-bold mb-2">Lakeside Villas</h3>
                <p className="text-blue-100 text-sm mb-3">Luxury meets nature</p>
                <button className="text-sm font-medium underline">View Villas</button>
                <Waves className="absolute bottom-2 right-2 w-8 h-8 text-white/20" />
              </div>
              
              <div className="bg-green-500 rounded-2xl text-white p-6 relative overflow-hidden">
                <h3 className="text-lg font-bold mb-2">Safari Lodges</h3>
                <p className="text-green-100 text-sm mb-3">Wildlife at your doorstep</p>
                <button className="text-sm font-medium underline">Book Safari</button>
                <Mountain className="absolute bottom-2 right-2 w-8 h-8 text-white/20" />
              </div>
            </div>
          </div>
        </section>

        {/* Property Types */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Browse by property type</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Link to={type.path} key={type.name} className="group text-center">
                  <div className="bg-gray-50 group-hover:bg-blue-50 rounded-lg p-4 mb-3 transition-colors">
                    <Icon className="w-8 h-8 mx-auto text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
                  <p className="text-xs text-gray-500">{type.count} properties</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Travel Deals & Highlights Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Travel Deals & Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialOffers.map((offer) => {
              const Icon = offer.icon;
              return (
                <Link 
                  to={offer.path}
                  key={offer.id}
                  className={`group relative rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 bg-gradient-to-r ${offer.color} text-white`}
                >
                  <div className="p-6">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                    <p className="text-white/90 mb-4">{offer.description}</p>
                    <div className="text-3xl font-bold mb-2">{offer.discount}% OFF</div>
                    <button className="mt-2 px-4 py-2 bg-white text-primary rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
                      Claim Offer
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Experiences */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Experiences</h2>
              <p className="text-gray-600 mt-1">Discover unique activities and tours</p>
            </div>
            <Link to="/experiences" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {experiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">What Our Travelers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.imageUrl} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {testimonial.location}
                    </p>
                  </div>
                  {testimonial.verified && (
                    <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                  )}
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Travel Statistics */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Trusted by Thousands</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {travelStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-12 bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] rounded-2xl p-8 border border-white/30 backdrop-blur-lg">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Why choose Egret Hospitality?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Globe className="w-8 h-8 text-white" style={{ background: 'linear-gradient(90deg, #0079C1 0%, #00AEEF 60%, #7ED321 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Local Expertise</h3>
              <p className="text-white/90 text-sm">
                We know Uganda best - our team is based here and we personally verify every listing.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CreditCard className="w-8 h-8 text-white" style={{ background: 'linear-gradient(90deg, #0079C1 0%, #00AEEF 60%, #7ED321 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Best Price Guarantee</h3>
              <p className="text-white/90 text-sm">
                Found a better price elsewhere? We'll match it and give you an additional discount.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Headphones className="w-8 h-8 text-white" style={{ background: 'linear-gradient(90deg, #0079C1 0%, #00AEEF 60%, #7ED321 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">24/7 Support</h3>
              <p className="text-white/90 text-sm">
                Our local customer service team is available around the clock to assist you.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Restaurants */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <Utensils className="w-8 h-8 text-orange-500 mr-3" />
                Explore Top-Rated Restaurants
              </h2>
              <p className="text-gray-600 mt-1">Discover the best dining experiences in Uganda</p>
            </div>
            <Link to="/restaurants" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <>
                <div className="col-span-4 text-center py-12 text-gray-500">Loading top restaurants...</div>
                {Array(4).fill(0).map((_, i) => <SkeletonCard key={`restaurant-skeleton-${i}`} />)}
              </>
            ) : filteredRestaurants.length === 0 ? (
              <div className="col-span-4 text-center py-12">
                <div className="text-gray-500 mb-4 flex flex-col items-center">
                  <span className="text-3xl mb-2" role="img" aria-label="no restaurants">😕</span>
                  No restaurants found for your search.
                </div>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="font-medium flex items-center gap-1 bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] text-white px-3 py-1.5 rounded-md hover:opacity-90"
                >
                  Clear search <span aria-hidden>↻</span>
                </button>
              </div>
            ) : (
              filteredRestaurants
                .slice(0, 4)
                .map(restaurant => (
                  <PropertyCard key={restaurant.id} property={restaurant} type="restaurant" />
                ))
            )}
          </div>
        </section>

        {/* Mobile App Promotion */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] rounded-2xl text-white p-8 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Get our mobile app</h2>
                <p className="text-blue-100 mb-6">Book on the go, get exclusive mobile deals, and access your trips offline</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span>Exclusive mobile-only deals</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span>Instant booking confirmations</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span>Offline access to your bookings</span>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors">
                    <Smartphone className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="font-semibold">App Store</div>
                    </div>
                  </button>
                  <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors">
                    <Play className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-xs">Get it on</div>
                      <div className="font-semibold">Google Play</div>
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="text-center lg:text-right">
                <div className="inline-block bg-white/10 rounded-2xl p-6">
                  <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center mx-auto">
                    <div className="text-6xl">📱</div>
                  </div>
                  <p className="mt-4 text-sm text-blue-100">Scan QR code to download</p>
                </div>
              </div>
            </div>
            
            <Smartphone className="absolute bottom-4 right-4 w-24 h-24 text-white/10" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;










