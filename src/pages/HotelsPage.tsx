import React, { useState, useEffect, useRef } from 'react';
import { FaTrashAlt, FaHome, FaEye, FaPhoneAlt, FaEnvelope, FaUserCircle } from 'react-icons/fa';
import { Star, MapPin, Search, Wifi, Coffee, Loader2, Filter, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import apiService from '../services/apiService';
import { useToast } from "../hooks/use-toast";
import { Toaster } from "react-hot-toast";

interface Property {
  id: number;
  propertyName: string;
  title?: string;
  description?: string;
  location: string | { city?: string; country?: string };
  streetDetails?: string;
  basePrice: number;
  cleaningFee?: number;
  currency: string;
  discount?: number;
  rating: number;
  photos: Array<{ url?: string }>;
  amenities: string[];
  roomType: string;
  bedCount: number;
  bedType?: string;
  bathroomCount: number;
  roomCount?: number;
  roomSize?: string;
  highlights?: string[];
  houseRules?: string[];
  photoDescriptions?: string[];
  cancellationPolicy: string;
  isActive: boolean;
  distanceToCenter?: string;
  isWishlisted?: boolean;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

const HotelsPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const { toast } = useToast();
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(6);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [viewMode] = useState<'grid' | 'list'>('grid');
  const [showManagementMode, setShowManagementMode] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService().sendPostToServerWithOutToken('businesses/getproperties', {});

        console.log('API Response:', response); // Debug log

        if (response.status === 200 && Array.isArray(response.data)) {
          const mappedProperties: Property[] = response.data.map((item: any) => ({
            id: item.id,
            propertyName: item.propertyName || 'Untitled Property',
            title: item.title,
            description: item.description,
            location: item.location?.city && item.location?.country ? `${item.location.city}, ${item.location.country}` : item.location || '',
            streetDetails: item.streetDetails || item.street_details,
            basePrice: item.basePrice || item.base_price || 0,
            cleaningFee: item.cleaningFee || item.cleaning_fee,
            currency: item.currency,
            discount: item.discount,
            rating: item.rating,
            photos: item.photos || [],
            amenities: item.amenities || [],
            roomType: item.propertyType || item.room_type,
            bedCount: item.bedCount || item.bed_count || 0,
            bedType: item.bedType || item.bed_type,
            bathroomCount: item.bathroomCount || item.bathroom_count || 0,
            roomCount: item.roomCount || item.room_count,
            roomSize: item.roomSize || item.room_size,
            highlights: item.highlights || [],
            houseRules: item.houseRules || item.house_rules,
            photoDescriptions: item.photoDescriptions || item.photo_descriptions,
            cancellationPolicy: item.cancellationPolicy || item.cancellation_policy || '',
            isActive: item.isActive !== undefined ? item.isActive : item.is_active,
            distanceToCenter: item.distanceToCenter || item.distance_to_center,
            isWishlisted: false,
            contactName: item.contactName,
            contactEmail: item.contactEmail,
            contactPhone: item.contactPhone,
          }));
          
          console.log('Mapped Properties:', mappedProperties); // Debug log
          console.log('Properties count:', mappedProperties.length); // Debug log
          
          setProperties(mappedProperties);
          setFilteredProperties(mappedProperties);
          const types = [...new Set(mappedProperties.map((p: Property) => p.roomType))];
          setPropertyTypes(['all', ...types.filter((type): type is string => typeof type === 'string')]);
          toast({ title: "Properties Loaded", description: "Properties loaded successfully." });
        } else {
          throw new Error(response?.message || 'Invalid response format');
        }
      } catch (error: any) {
        console.error('Fetch Properties Error:', error); // Debug log
        setError(error.message || 'Failed to fetch properties');
        toast({
          title: "Error",
          description: error.message || "Failed to fetch properties",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [toast]);

  useEffect(() => {
    // Reset refs array
    cardsRef.current = [];
  }, [filteredProperties, currentPage]);

  useEffect(() => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof p.location === 'string' && p.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    filtered = filtered.filter(p =>
      p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1]
    );

    if (rating > 0) {
      filtered = filtered.filter(p => p.rating >= rating);
    }

    if (selectedPropertyType !== 'all') {
      filtered = filtered.filter(p => p.roomType === selectedPropertyType);
    }

    // Optional: Add sorting logic here if needed

    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [properties, searchTerm, priceRange, rating, selectedPropertyType, sortBy]);

  // Pagination logic
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


  const toggleWishlist = (propertyId: number) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, isWishlisted: !p.isWishlisted } : p
    ));
    setFilteredProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, isWishlisted: !p.isWishlisted } : p
    ));
  };

  const renderAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes('wifi')) {
      return <Wifi className="h-4 w-4 mr-1" />;
    }
    if (amenity.toLowerCase().includes('breakfast') || amenity.toLowerCase().includes('coffee')) {
      return <Coffee className="h-4 w-4 mr-1" />;
    }
    return null;
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return getFallbackImageUrl();
    if (url.startsWith('data:')) return url; // Return base64 strings directly
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `${window.location.origin}${url}`;
    if (url.startsWith('./')) return `${window.location.origin}/${url.substring(2)}`;
    return `${window.location.origin}/${url}`;
  };

  const getFallbackImageUrl = () => {
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80';
  };

  const PropertyImage = ({ property }: { property: Property }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const imageUrl = property.photos?.[0]?.url 
      ? ensureAbsoluteUrl(property.photos[0].url)
      : null;

    if (!imageUrl || imageError) {
      return (
        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">No image available</span>
        </div>
      );
    }

    return (
      <div className="h-full w-full overflow-hidden bg-gray-100 relative">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-full h-full"></div>
          </div>
        )}
        <img
          src={imageUrl}
          alt={`${property.propertyName} - ${property.roomType}`}
          className={`w-full h-full object-cover ${imageLoaded ? 'visible' : 'invisible'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  };

  const ConfirmDeleteModal = ({ propertyId }: { propertyId: number | null }) => {
    if (propertyId === null) return null;
    const property = properties.find(p => p.id === propertyId);
    if (!property) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Delete Property</h2>
          <p className="mb-6 text-gray-700">Are you sure you want to delete this property{property ? `: "${property.propertyName}"` : ''}?</p>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              className="px-4 py-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors flex items-center gap-2"
              onClick={() => setConfirmDeleteId(null)}
              disabled={deletingId === propertyId}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 rounded text-white transition-colors flex items-center gap-2 ${
                deletingId === propertyId
                  ? 'bg-red-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              onClick={() => handleDelete(propertyId)}
              disabled={deletingId === propertyId}
            >
              <FaTrashAlt />
              {deletingId === propertyId ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);

    try {
      const response = await apiService().sendPostToServerWithOutToken('businesses/deleteproperty', { id });

      if (response.status === 200) {
        setProperties(prev => prev.filter(property => property.id !== id));
        toast({
          title: "Success",
          description: "Property deleted successfully",
        });
      } else {
        throw new Error(response.message || 'Failed to delete property');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to delete property',
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleViewProperty = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
  };

  const handleBackFromDetails = () => {
    setSelectedPropertyId(null);
  };



  // Dummy PropertyDetailsScreen component for demonstration
  interface PropertyDetailsScreenProps {
    property: any;
    onBack: () => void;
  }
  const PropertyDetailsScreen: React.FC<PropertyDetailsScreenProps> = ({ property, onBack }) => (
    <div className="p-8 bg-white rounded-lg shadow">
      <button onClick={onBack} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">Back</button>
      <h2 className="text-2xl font-bold mb-2">{property.propertyName}</h2>
      <p className="mb-2">Type: {property.propertyType}</p>
      <p className="mb-2">Location: {property.location?.city}, {property.location?.country}</p>
      <p className="mb-2">Contact: {property.contactName} ({property.contactEmail}, {property.contactPhone})</p>
      <p className="mb-2">Rooms: {property.roomCount}, Bathrooms: {property.bathroomCount}</p>
      <p className="mb-2">Price: {property.basePrice} {property.currency}</p>
      <div className="mt-4">
        <h3 className="font-semibold">Highlights:</h3>
        <ul className="list-disc ml-6">
          {property.highlights?.map((h: string, i: number) => <li key={i}>{h}</li>)}
        </ul>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Photos:</h3>
        <div className="flex gap-2 flex-wrap">
          {property.photos?.map((photo: any, i: number) => (
            <img key={i} src={photo.url} alt={`Photo ${i + 1}`} className="w-32 h-24 object-cover rounded" />
          ))}
        </div>
      </div>
    </div>
  );

  // If a property is selected for viewing, show the details screen
  if (selectedPropertyId !== null) {
    const selectedProperty = properties.find(p => p.id === selectedPropertyId);
    if (selectedProperty) {
      // Transform the property data to match PropertyDetailsScreen interface
      const transformedProperty = {
        id: selectedProperty.id,
        propertyName: selectedProperty.propertyName,
        propertyType: selectedProperty.roomType,
        location: typeof selectedProperty.location === 'string' 
          ? { city: selectedProperty.location, country: '' }
          : selectedProperty.location,
        streetDetails: { street: selectedProperty.streetDetails },
        contactName: selectedProperty.contactName || '',
        contactEmail: selectedProperty.contactEmail || '',
        contactPhone: selectedProperty.contactPhone || '',
        roomCount: selectedProperty.roomCount,
        bathroomCount: selectedProperty.bathroomCount,
        basePrice: selectedProperty.basePrice,
        currency: selectedProperty.currency,
        discount: selectedProperty.discount,
        cleaningFee: selectedProperty.cleaningFee,
        cancellationPolicy: selectedProperty.cancellationPolicy,
        highlights: selectedProperty.highlights || [],
        preferredLanguage: '',
        createdOn: '',
        photos: selectedProperty.photos || []
      };
      return (
        <PropertyDetailsScreen 
          property={transformedProperty}
          onBack={handleBackFromDetails} 
        />
      );
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <ConfirmDeleteModal propertyId={confirmDeleteId} />

        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Properties</h1>
              <p className="text-gray-600">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} available
              </p>
              {/* Debug info */}
              <p className="text-sm text-gray-500">
                Total properties: {properties.length} | Filtered: {filteredProperties.length}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  console.log('All properties:', properties);
                  console.log('Filtered properties:', filteredProperties);
                  alert(`Total: ${properties.length}, Filtered: ${filteredProperties.length}`);
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Debug Info
              </button>
              <button
                onClick={() => setShowManagementMode(!showManagementMode)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <FaHome />
                {showManagementMode ? 'View Mode' : 'Manage Properties'}
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 sticky top-0 z-10">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-grow relative w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search properties"
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-green-500 focus:border-teal-500"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>

              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <option value="recommended">Recommended</option>
                <option value="price_low">Price (low to high)</option>
                <option value="price_high">Price (high to low)</option>
                <option value="rating">Top rated</option>
                <option value="distance">Distance from center</option>
              </select>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price range</label>
                  <select
                    value={`${priceRange[0]}-${priceRange[1]}`}
                    onChange={(e) => {
                      const [min, max] = e.target.value.split('-').map(Number);
                      setPriceRange([min, max]);
                    }}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3"
                  >
                    <option value="0-1000">Any Price</option>
                    <option value="0-100">Under $100</option>
                    <option value="100-200">$100-$200</option>
                    <option value="200-300">$200-$300</option>
                    <option value="300-500">$300-$500</option>
                    <option value="500-1000">$500+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3"
                  >
                    <option value={0}>Any rating</option>
                    <option value={3}>3+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property type</label>
                  <select
                    value={selectedPropertyType}
                    onChange={(e) => setSelectedPropertyType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3"
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Types' : type.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Property Listings */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <span className="ml-2">Loading properties...</span>
            </div>
          ) : currentProperties.length > 0 ? (
            <div className={viewMode === 'grid' ? "space-y-6" : "space-y-6"}>
              {/* Property Cards */}
              {currentProperties.map((property, index) => (
                <div
                  key={property.id}
                  ref={el => cardsRef.current[index] = el as HTMLDivElement}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col md:flex-row ${
                    viewMode === 'list' ? 'gap-4' : ''
                  }`}
                >
                  {/* Property Image with Wishlist */}
                  <div className={`relative ${viewMode === 'list' ? 'md:w-1/3 h-64' : 'w-full md:w-1/3 h-64 md:h-auto'}`}>
                    <PropertyImage property={property} />
                    <button 
                      onClick={() => toggleWishlist(property.id)}
                      className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all z-10"
                    >
                      <Heart 
                        className={`h-5 w-5 ${property.isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                      />
                    </button>
                    {property.discount && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                        {property.discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{property.propertyName}</h3>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{typeof property.location === 'string' ? property.location : `${property.location?.city ?? ''} ${property.location?.country ?? ''}`.trim()}</span>
                          {property.distanceToCenter && (
                            <span className="ml-2 text-gray-400">{property.distanceToCenter}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{property.rating !== undefined && property.rating !== null ? property.rating.toFixed(1) : 'N/A'}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mt-2 line-clamp-2">{property.description}</p>

                    {/* Amenities Carousel */}
                    <div className="mt-4 relative">
                      <button 
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                      </button>
                      <div 
                        ref={containerRef}
                        className="flex overflow-x-auto hide-scrollbar space-x-2 py-2 px-6"
                      >
                        {property.amenities.map((amenity, i) => (
                          <span
                            key={i}
                            className="flex-shrink-0 text-xs bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full flex items-center"
                          >
                            {renderAmenityIcon(amenity)}
                            {amenity.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                      <button 
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
                      <button
                        onClick={() => handleViewProperty(property.id)}
                        className="flex-1 min-w-[120px] py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        <span>View Details</span>
                      </button>
                      {showManagementMode && (
                        <div className="relative group">
                          <button
                            onClick={() => setConfirmDeleteId(property.id)}
                            className={`p-2 rounded-full transition-all ${
                              deletingId === property.id
                                ? 'bg-red-400 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600 hover:scale-110'
                            }`}
                            disabled={deletingId === property.id}
                            aria-label="Delete property"
                          >
                            <FaTrashAlt className="text-white text-sm" />
                          </button>
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Delete Property
                          </span>
                        </div>
                      )}
                    </div>

                    {showManagementMode && (
                      <div className="border-t pt-4 mt-auto">
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Contact Information</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaUserCircle className="h-4 w-4 mr-2" />
                            <span>{property.contactName}</span>
                          </div>
                          <div className="flex items-center">
                            <FaEnvelope className="h-4 w-4 mr-2" />
                            <span>{property.contactEmail}</span>
                          </div>
                          <div className="flex items-center">
                            <FaPhoneAlt className="h-4 w-4 mr-2" />
                            <span>{property.contactPhone}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="h-16 w-16 text-gray-400 mx-auto mb-4">
                <Search className="h-full w-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setPriceRange([0, 1000]);
                  setRating(0);
                  setSelectedPropertyType('all');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded border border-gray-300 disabled:opacity-50 flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`px-4 py-2 rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded border border-gray-300 disabled:opacity-50 flex items-center"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </nav>
            </div>
          )}
        </div>

        <style>
          {`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
        </style>
      </div>
    </>
  );
};

export default HotelsPage;
