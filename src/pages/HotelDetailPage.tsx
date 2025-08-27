import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Wifi, Coffee, Tv, Users, Loader2, Calendar } from 'lucide-react';
import apiService from '../services/apiService';
import { useToast } from "../hooks/use-toast";

interface PropertyDetail {
  id: string;
  property_name: string;
  title: string;
  location: string;
  street_details: string;
  description: string;
  base_price: number;
  rating: number;
  room_type: string;
  bed_count: number;
  bed_type: string;
  bathroom_count: number;
  room_count: number;
  room_size: number;
  amenities: string[];
  highlights: string[];
  house_rules: string[];
  photos: string[];
  cancellation_policy: string;
  cleaning_fee: number;
  currency: string;
  discount?: number;
  is_active: boolean;
}

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [guests, setGuests] = useState(1);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    interface ApiResponse {
      returnObject?: PropertyDetail;
      [key: string]: any;
    }

    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response: ApiResponse = await apiService().sendGetToServer(`/properties/${id}`);
        
        if (response?.returnObject) {
          setProperty(response.returnObject);
        } else {
          toast({
            title: "Error",
            description: "Property not found",
            variant: "destructive",
          });
          navigate('/properties');
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.response?.data?.message || "Failed to load property details",
          variant: "destructive",
        });
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id, navigate, toast]);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate) return property?.base_price || 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const nights = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return nights * (property?.base_price || 0);
  };

  const handleCheckOutChange = (date: string) => {
    setCheckOutDate(date);
    // If check-in is after check-out, reset check-in
    if (checkInDate && new Date(date) <= new Date(checkInDate)) {
      setCheckInDate('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property || !property.is_active) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Available</h2>
          <p className="text-gray-600 mb-6">We couldn't find the property you were looking for.</p>
          <Link 
            to="/properties" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Property Header */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{property.property_name}</h1>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-gray-700">{property.rating.toFixed(1)}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="ml-1 text-gray-500">
                      {property.location}{property.street_details ? `, ${property.street_details}` : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="relative bg-gray-200 h-64 sm:h-96 w-full">
            <img 
              src={property.photos[activePhotoIndex] || '/placeholder-hotel.jpg'} 
              alt={property.property_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-hotel.jpg';
              }}
            />
            {property.photos.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {property.photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActivePhotoIndex(index)}
                    className={`w-3 h-3 rounded-full ${activePhotoIndex === index ? 'bg-blue-600' : 'bg-white bg-opacity-60'}`}
                    aria-label={`View photo ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{property.title}</h2>
                <p className="text-gray-600 mb-6 whitespace-pre-line">{property.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Details</h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex">
                        <span className="font-medium w-32">Room Type:</span>
                        <span>{property.room_type.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Bedrooms:</span>
                        <span>{property.room_count}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Beds:</span>
                        <span>{property.bed_count} ({property.bed_type})</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Bathrooms:</span>
                        <span>{property.bathroom_count}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Size:</span>
                        <span>{property.room_size} sq ft</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Highlights</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      {property.highlights?.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {property.amenities?.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        {amenity.includes('WiFi') && <Wifi className="h-5 w-5 text-blue-500 mr-2" />}
                        {amenity.includes('Breakfast') && <Coffee className="h-5 w-5 text-blue-500 mr-2" />}
                        {amenity.includes('TV') && <Tv className="h-5 w-5 text-blue-500 mr-2" />}
                        <span className="text-gray-700">{amenity.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">House Rules</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {property.house_rules?.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column - Booking Widget */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-4">
                  <div className="flex items-baseline mb-4">
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(property.base_price, property.currency)}
                    </span>
                    {property.discount && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {formatCurrency(property.base_price + (property.discount || 0), property.currency)}
                      </span>
                    )}
                    <span className="text-sm font-normal text-gray-500 ml-1">per night</span>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          Check-in
                        </label>
                        <input
                          type="date"
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          Check-out
                        </label>
                        <input
                          type="date"
                          value={checkOutDate}
                          onChange={(e) => handleCheckOutChange(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm"
                          min={checkInDate || new Date().toISOString().split('T')[0]}
                          disabled={!checkInDate}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        Guests
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">
                          {formatCurrency(property.base_price, property.currency)} x {checkInDate && checkOutDate ? 
                          Math.floor((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)) : 1} nights
                        </span>
                        <span>{formatCurrency(calculateTotal(), property.currency)}</span>
                      </div>
                      {property.cleaning_fee > 0 && (
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Cleaning fee</span>
                          <span>{formatCurrency(property.cleaning_fee, property.currency)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span>{formatCurrency(calculateTotal() + property.cleaning_fee, property.currency)}</span>
                      </div>
                    </div>

                    <Link
                      to={`/booking/property/${property.id}`}
                      state={{
                        checkInDate,
                        checkOutDate,
                        guests,
                        total: calculateTotal() + property.cleaning_fee,
                        propertyName: property.property_name
                      }}
                      className={`block w-full text-white text-center py-3 rounded-lg font-medium transition-colors ${
                        checkInDate && checkOutDate 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      onClick={(e) => {
                        if (!checkInDate || !checkOutDate) {
                          e.preventDefault();
                          toast({
                            title: "Please select dates",
                            description: "You need to select both check-in and check-out dates",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      Book Now
                    </Link>

                    {property.cancellation_policy.toLowerCase().includes('free') ? (
                      <div className="text-sm text-green-600 text-center mt-2">
                        Free cancellation available
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 text-center mt-2">
                        {property.cancellation_policy}
                      </div>
                    )}
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

export default PropertyDetailPage;