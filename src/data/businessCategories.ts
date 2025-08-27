export interface BusinessCategory {
  name: string;
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  subcategories?: BusinessSubcategory[];
  baseFields?: FormField[];
}

export interface BusinessSubcategory {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'checkbox' | 'rating' | 'map' | 'multi-select' | 'file' | 'time' | 'boolean';
  required: boolean;
  options?: string[];
  placeholder?: string;
  multiple?: boolean;
  dependsOn?: {
    fieldId: string;
    values: string[];
  };
  dynamicFields?: { [key: string]: FormField[] };
}

export const frontendBusinessCategories: BusinessCategory[] = [
  // ==========================
  // Accommodation
  // ==========================
  {
    id: 'accommodation',
    title: 'Accommodation',
    description: 'Hotels, lodges, resorts, and unique stays',
    icon: 'Hotel',
    gradient: 'from-blue-500 to-purple-600',
    subcategories: [
      {
        id: 'hotels',
        title: 'Hotels',
        description: 'Traditional hotel accommodations',
        fields: [
          { id: 'name', label: 'Hotel Name', type: 'text', required: true },
          { id: 'starRating', label: 'Star Rating', type: 'rating', required: true },
          { id: 'hotelType', label: 'Type of Hotel', type: 'select', required: true, options: ['Boutique', 'Resort', 'Business', 'Budget', 'Hostel', 'Luxury'] },
          { id: 'rooms', label: 'Total Number of Rooms', type: 'number', required: true },

          { id: 'address', label: 'Address', type: 'text', required: true },
          { id: 'city', label: 'City', type: 'text', required: true },
          { id: 'country', label: 'Country', type: 'text', required: true },
          { id: 'gps', label: 'GPS Coordinates', type: 'map', required: true },
          { id: 'landmarks', label: 'Nearby Landmarks', type: 'textarea', required: false, placeholder: 'Airport, City Center, Attractions...' },

          {
            id: 'roomTypes',
            label: 'Room Types',
            type: 'multi-select',
            required: true,
            options: ['Single', 'Double', 'Suite', 'Family', 'Dorms'],
            dynamicFields: {
              Single: [
                { id: 'single_beds', label: 'Number of Beds', type: 'number', required: true },
                { id: 'single_maxGuests', label: 'Max Guests', type: 'number', required: true },
                { id: 'single_amenities', label: 'Amenities', type: 'multi-select', required: false, options: ['WiFi', 'TV', 'AC', 'Balcony'] },
                { id: 'single_price', label: 'Price per Night', type: 'number', required: true }
              ],
              Double: [
                { id: 'double_beds', label: 'Number of Beds', type: 'number', required: true },
                { id: 'double_maxGuests', label: 'Max Guests', type: 'number', required: true },
                { id: 'double_amenities', label: 'Amenities', type: 'multi-select', required: false, options: ['WiFi', 'TV', 'AC', 'Balcony'] },
                { id: 'double_price', label: 'Price per Night', type: 'number', required: true }
              ],
              Suite: [
                { id: 'suite_beds', label: 'Number of Beds', type: 'number', required: true },
                { id: 'suite_maxGuests', label: 'Max Guests', type: 'number', required: true },
                { id: 'suite_amenities', label: 'Amenities', type: 'multi-select', required: false, options: ['WiFi', 'TV', 'AC', 'Balcony', 'Jacuzzi'] },
                { id: 'suite_price', label: 'Price per Night', type: 'number', required: true }
              ],
              Family: [
                { id: 'family_beds', label: 'Number of Beds', type: 'number', required: true },
                { id: 'family_maxGuests', label: 'Max Guests', type: 'number', required: true },
                { id: 'family_amenities', label: 'Amenities', type: 'multi-select', required: false, options: ['WiFi', 'TV', 'AC', 'Balcony', 'Kitchenette'] },
                { id: 'family_price', label: 'Price per Night', type: 'number', required: true }
              ],
              Dorms: [
                { id: 'dorms_beds', label: 'Number of Beds', type: 'number', required: true },
                { id: 'dorms_maxGuests', label: 'Max Guests', type: 'number', required: true },
                { id: 'dorms_amenities', label: 'Amenities', type: 'multi-select', required: false, options: ['WiFi', 'Locker', 'Shared Bathroom'] },
                { id: 'dorms_price', label: 'Price per Night', type: 'number', required: true }
              ]
            }
          },
          { id: 'amenities', label: 'Amenities', type: 'multi-select', required: true, options: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Parking', 'Shuttle Service', 'Room Service', 'Air Conditioning'] },
          { id: 'accessibility', label: 'Accessibility Features', type: 'multi-select', required: false, options: ['Wheelchair Access', 'Elevators', 'Braille Signs', 'Accessible Bathrooms'] },

          { id: 'cancellationPolicy', label: 'Cancellation Policy', type: 'textarea', required: true },
          { id: 'checkIn', label: 'Check-in Time', type: 'time', required: true },
          { id: 'checkOut', label: 'Check-out Time', type: 'time', required: true },

          { id: 'photos', label: 'Hotel Photos', type: 'file', required: true, multiple: true },


          { id: 'diningOptions', label: 'Dining Options', type: 'multi-select', required: false, options: ['Buffet Breakfast', 'Fine Dining', 'Café', 'Bar', 'Room Service'] },
          { id: 'languages', label: 'Languages Spoken', type: 'multi-select', required: false, options: ['English', 'French', 'Spanish', 'Arabic', 'Chinese', 'Other'] },
          { id: 'paymentMethods', label: 'Accepted Payment Methods', type: 'multi-select', required: false, options: ['Cash', 'Credit Card', 'Mobile Money', 'Bank Transfer'] },

          { id: 'safetyFeatures', label: 'Safety Features', type: 'multi-select', required: false, options: ['Fire Extinguishers', 'First Aid Kits', 'CCTV', 'Smoke Detectors'] },
          { id: 'hygieneMeasures', label: 'Hygiene Measures', type: 'textarea', required: false, placeholder: 'COVID-19 precautions, cleaning protocols...' },

          { id: 'awards', label: 'Awards & Certifications', type: 'textarea', required: false, placeholder: 'Eco-friendly, Top-rated, etc.' },
          { id: 'specialFeatures', label: 'Special Features', type: 'textarea', required: false, placeholder: 'Beach Access, Conference Halls, Wedding Packages...' }
        ]
      },
      {
        id: 'lodges',
        title: 'Safari Lodges',
        description: 'Safari and wilderness lodges',
        fields: [
          { id: 'name', label: 'Lodge Name', type: 'text', required: true },
          { id: 'starRating', label: 'Star Rating', type: 'rating', required: false },
          { id: 'lodgeType', label: 'Lodge Type', type: 'multi-select', required: true, options: ['Luxury Lodge', 'Mid-range Lodge', 'Budget Lodge', 'Tented Camp', 'Eco-lodge'] },

          { id: 'location', label: 'Location / National Park / Reserve', type: 'text', required: true },
          { id: 'country', label: 'Country', type: 'text', required: true },
          { id: 'gps', label: 'GPS Coordinates', type: 'map', required: true },
          { id: 'nearbyAttractions', label: 'Nearby Attractions', type: 'textarea', required: false, placeholder: 'Waterfalls, Wildlife Reserves, Villages...' },

          { id: 'capacity', label: 'Total Guest Capacity', type: 'number', required: true },
          {
            id: 'roomTypes',
            label: 'Room Types',
            type: 'multi-select',
            required: true,
            options: ['Luxury Suite', 'Tent', 'Cabin', 'Family Room', 'Honeymoon Suite'],
            dynamicFields: {
              'Luxury Suite': [
                { id: 'luxurySuite_beds', label: 'Number of Beds', type: 'number', required: true },
                { id: 'luxurySuite_maxGuests', label: 'Max Guests', type: 'number', required: true },
                { id: 'luxurySuite_amenities', label: 'Amenities', type: 'multi-select', required: false, options: ['WiFi', 'Balcony', 'Mini Bar', 'Fireplace'] },
                { id: 'luxurySuite_price', label: 'Price per Night', type: 'number', required: true }
              ],
              Tent: [
                { id: 'tent_beds', label: 'Number of Beds', type: 'number', required: true },
                { id: 'tent_maxGuests', label: 'Max Guests', type: 'number', required: true },
                { id: 'tent_amenities', label: 'Amenities', type: 'multi-select', required: false, options: ['WiFi', 'Mosquito Net', 'Outdoor Shower'] },
                { id: 'tent_price', label: 'Price per Night', type: 'number', required: true }
              ],
              Cabin: [
                { id: 'cabin_beds', label: 'Number of Beds', type: 'number', required: true },
                { id: 'cabin_maxGuests', label: 'Max Guests', type: 'number', required: true },
                { id: 'cabin_amenities', label: 'Amenities', type: 'multi-select', required: false, options: ['WiFi', 'Fireplace', 'Porch'] },
                { id: 'cabin_price', label: 'Price per Night', type: 'number', required: true }
              ],
              'Family Room': [
                { id: 'familyRoom_beds', label: 'Number of Beds', type: 'number', required: true },
                { id: 'familyRoom_maxGuests', label: 'Max Guests', type: 'number', required: true },
                { id: 'familyRoom_amenities', label: 'Amenities', type: 'multi-select', required: false, options: ['WiFi', 'Kitchenette', 'TV'] },
                { id: 'familyRoom_price', label: 'Price per Night', type: 'number', required: true }
              ],
              'Honeymoon Suite': [
                { id: 'honeymoonSuite_beds', label: 'Number of Beds', type: 'number', required: true },
                { id: 'honeymoonSuite_maxGuests', label: 'Max Guests', type: 'number', required: true },
                { id: 'honeymoonSuite_amenities', label: 'Amenities', type: 'multi-select', required: false, options: ['WiFi', 'Jacuzzi', 'Private Balcony'] },
                { id: 'honeymoonSuite_price', label: 'Price per Night', type: 'number', required: true }
              ]
            }
          },
          { id: 'bedsPerRoom', label: 'Beds per Room', type: 'number', required: false },
          { id: 'maxGuests', label: 'Max Guests per Room', type: 'number', required: false },
          { id: 'privateBathrooms', label: 'Private Bathrooms Available?', type: 'checkbox', required: false },

          { id: 'activities', label: 'Included Activities', type: 'multi-select', required: true, options: ['Game Drives', 'Walking Safaris', 'Bird Watching', 'Boat Safari', 'Cultural Tours', 'Night Drives'] },
          { id: 'season', label: 'Best Season to Visit', type: 'select', required: true, options: ['Year-round', 'Dry Season', 'Wet Season', 'Migration Season'] },
          { id: 'wildlifeHighlights', label: 'Wildlife Highlights', type: 'textarea', required: false, placeholder: 'Big Five, Bird Species, Rare Animals...' },

          { id: 'amenities', label: 'Lodge Amenities', type: 'multi-select', required: true, options: ['Swimming Pool', 'Spa', 'Bar', 'Restaurant', 'WiFi', 'Fireplace', 'Library', 'Gift Shop'] },
          { id: 'dining', label: 'Dining Options', type: 'multi-select', required: false, options: ['Full Board', 'Half Board', 'All-Inclusive', 'Vegetarian Menu', 'Private Dining'] },
          { id: 'sustainability', label: 'Eco & Sustainability Practices', type: 'textarea', required: false, placeholder: 'Solar power, Water recycling, Community support...' },

          { id: 'priceRange', label: 'Price Range per Night', type: 'number', required: true, placeholder: 'Enter price per night' },
          { id: 'ratesInclude', label: 'Rates Include', type: 'textarea', required: true, placeholder: 'Meals, Activities, Transfers...' },
          { id: 'checkIn', label: 'Check-in Time', type: 'time', required: false },
          { id: 'checkOut', label: 'Check-out Time', type: 'time', required: false },
          { id: 'cancellationPolicy', label: 'Cancellation Policy', type: 'textarea', required: true },

          { id: 'photos', label: 'Lodge Photos', type: 'file', required: true, multiple: true },


          { id: 'languages', label: 'Languages Spoken', type: 'multi-select', required: false, options: ['English', 'French', 'Spanish', 'Swahili', 'Local Dialects'] },
          { id: 'paymentMethods', label: 'Accepted Payment Methods', type: 'multi-select', required: false, options: ['Cash', 'Credit Card', 'Mobile Money', 'Bank Transfer'] },
          { id: 'specialFeatures', label: 'Unique Experiences', type: 'textarea', required: false, placeholder: 'Treehouse Rooms, Bush Dinners, Hot Air Balloon Safari...' }
        ]
      }
    ],
    name: ''
  },

// ==========================
// Safari & Tours
// ==========================
{
  id: 'safari',
  title: 'Safari & Tours',
  description: 'Wildlife tours, cultural experiences, and adventures',
  icon: 'Binoculars',
  gradient: 'from-green-500 to-yellow-500',
  subcategories: [
    {
      id: 'wildlife-safari',
      title: 'Wildlife Safari',
      description: 'Game drives and wildlife experiences',
      fields: [
        { id: 'tourName', label: 'Safari Package Name', type: 'text', required: true },
        { id: 'duration', label: 'Duration (days)', type: 'number', required: true },
        { id: 'parks', label: 'Parks/Reserves', type: 'textarea', required: true },
        { id: 'wildlife', label: 'Wildlife Highlights', type: 'textarea', required: true },
        { id: 'groupSize', label: 'Max Group Size', type: 'number', required: true },

        { id: 'startingPoint', label: 'Starting Point', type: 'text', required: true },
        {
          id: 'transportation',
          label: 'Transportation Type',
          type: 'select',
          required: true,
          options: ['4x4 Jeep', 'Safari Van', 'Bus', 'Air Transfer'],
          dynamicFields: {
            '4x4 Jeep': [
              { id: 'jeep_count', label: 'Number of Jeeps', type: 'number', required: true },
              { id: 'jeep_capacity', label: 'Seating Capacity per Jeep', type: 'number', required: true },
              {
                id: 'jeep_features',
                label: 'Jeep Features',
                type: 'multi-select',
                required: false,
                options: ['Pop-up Roof', 'Air Conditioning', 'Charging Ports', 'Cooler Box']
              }
            ],
            'Safari Van': [
              { id: 'van_count', label: 'Number of Vans', type: 'number', required: true },
              { id: 'van_capacity', label: 'Seating Capacity per Van', type: 'number', required: true },
              {
                id: 'van_features',
                label: 'Van Features',
                type: 'multi-select',
                required: false,
                options: ['Roof Hatch', 'Air Conditioning', 'Luggage Space', 'Charging Ports']
              }
            ],
            'Bus': [
              { id: 'bus_count', label: 'Number of Buses', type: 'number', required: true },
              { id: 'bus_capacity', label: 'Seating Capacity per Bus', type: 'number', required: true },
              {
                id: 'bus_facilities',
                label: 'Onboard Facilities',
                type: 'multi-select',
                required: false,
                options: ['Toilet', 'Air Conditioning', 'WiFi', 'Reclining Seats']
              }
            ],
            'Air Transfer': [
              { id: 'aircraft_type', label: 'Aircraft Type', type: 'text', required: true },
              { id: 'aircraft_capacity', label: 'Passenger Capacity', type: 'number', required: true },
              { id: 'luggage_limit', label: 'Luggage Limit (kg per passenger)', type: 'number', required: true },
              { id: 'flight_duration', label: 'Estimated Flight Duration (hours)', type: 'number', required: false }
            ]
          }
        },
        { id: 'languages', label: 'Guide Languages', type: 'multi-select', required: false, options: ['English', 'French', 'Spanish', 'Swahili', 'Local Dialects'] },

        { id: 'pricePerPerson', label: 'Price per Person', type: 'number', required: true },
        { id: 'inclusions', label: 'Included in Price', type: 'textarea', required: true, placeholder: 'Park Fees, Meals, Accommodation...' },
        { id: 'exclusions', label: 'Not Included', type: 'textarea', required: false },
        { id: 'cancellationPolicy', label: 'Cancellation Policy', type: 'textarea', required: true },

        { id: 'photos', label: 'Tour Photos', type: 'file', required: true, multiple: true }
      ]
    },
    {
      id: 'cultural-tours',
      title: 'Cultural Tours',
      description: 'Cultural immersion and heritage experiences',
      fields: [
        { id: 'tourName', label: 'Tour Name', type: 'text', required: true },
        { id: 'culture', label: 'Culture/Community', type: 'text', required: true },
        { id: 'activities', label: 'Cultural Activities', type: 'textarea', required: true },
        { id: 'duration', label: 'Duration (hours)', type: 'number', required: true },
        { id: 'language', label: 'Languages Spoken', type: 'text', required: true },

        { id: 'location', label: 'Location / Village / Heritage Site', type: 'text', required: true },
        { id: 'groupSize', label: 'Max Group Size', type: 'number', required: false },

        {
          id: 'transportation',
          label: 'Transportation Type',
          type: 'select',
          required: true,
          options: ['4x4 Jeep', 'Safari Van', 'Bus', 'Air Transfer'],
          dynamicFields: {
            '4x4 Jeep': [
              { id: 'jeep_count', label: 'Number of Jeeps', type: 'number', required: true },
              { id: 'jeep_capacity', label: 'Seating Capacity per Jeep', type: 'number', required: true },
              {
                id: 'jeep_features',
                label: 'Jeep Features',
                type: 'multi-select',
                required: false,
                options: ['Pop-up Roof', 'Air Conditioning', 'Charging Ports', 'Cooler Box']
              }
            ],
            'Safari Van': [
              { id: 'van_count', label: 'Number of Vans', type: 'number', required: true },
              { id: 'van_capacity', label: 'Seating Capacity per Van', type: 'number', required: true },
              {
                id: 'van_features',
                label: 'Van Features',
                type: 'multi-select',
                required: false,
                options: ['Roof Hatch', 'Air Conditioning', 'Luggage Space', 'Charging Ports']
              }
            ],
            'Bus': [
              { id: 'bus_count', label: 'Number of Buses', type: 'number', required: true },
              { id: 'bus_capacity', label: 'Seating Capacity per Bus', type: 'number', required: true },
              {
                id: 'bus_facilities',
                label: 'Onboard Facilities',
                type: 'multi-select',
                required: false,
                options: ['Toilet', 'Air Conditioning', 'WiFi', 'Reclining Seats']
              }
            ],
            'Air Transfer': [
              { id: 'aircraft_type', label: 'Aircraft Type', type: 'text', required: true },
              { id: 'aircraft_capacity', label: 'Passenger Capacity', type: 'number', required: true },
              { id: 'luggage_limit', label: 'Luggage Limit (kg per passenger)', type: 'number', required: true },
              { id: 'flight_duration', label: 'Estimated Flight Duration (hours)', type: 'number', required: false }
            ]
          }
        },

        { id: 'pricePerPerson', label: 'Price per Person', type: 'number', required: true },
        { id: 'inclusions', label: 'Included in Price', type: 'textarea', required: true },
        { id: 'exclusions', label: 'Not Included', type: 'textarea', required: false },
        { id: 'cancellationPolicy', label: 'Cancellation Policy', type: 'textarea', required: true },

        { id: 'photos', label: 'Tour Photos', type: 'file', required: true, multiple: true }
      ]
    }
  ],
  name: ''
},

// ==========================
// Airport Taxi
// ==========================
{
  id: 'transport',
  title: 'Airport Taxi',
  description: 'Airport transfers and transportation services',
  icon: 'Car',
  gradient: 'from-indigo-500 to-blue-600',
  subcategories: [
    {
      id: 'airport-transfer',
      title: 'Airport Transfer',
      description: 'Direct airport pickup and drop-off',
      fields: [
        { id: 'serviceName', label: 'Service Name', type: 'text', required: true },
        {
          id: 'vehicleType',
          label: 'Vehicle Type',
          type: 'multi-select',
          required: true,
          options: ['Sedan', 'SUV', 'Van', 'Luxury Car', 'Bus'],
          dynamicFields: {
            Sedan: [
              { id: 'sedan_capacity', label: 'Seating Capacity', type: 'number', required: true },
              { id: 'sedan_luggage', label: 'Luggage Capacity (bags)', type: 'number', required: true },
              { 
                id: 'sedan_features', 
                label: 'Features', 
                type: 'multi-select', 
                required: false, 
                options: ['Air Conditioning', 'WiFi', 'Child Seat', 'Phone Charger']
              }
            ],
            SUV: [
              { id: 'suv_capacity', label: 'Seating Capacity', type: 'number', required: true },
              { id: 'suv_luggage', label: 'Luggage Capacity (bags)', type: 'number', required: true },
              { 
                id: 'suv_features', 
                label: 'Features', 
                type: 'multi-select', 
                required: false, 
                options: ['Air Conditioning', 'All-Wheel Drive', 'WiFi', 'Child Seat', 'Phone Charger']
              }
            ],
            Van: [
              { id: 'van_capacity', label: 'Seating Capacity', type: 'number', required: true },
              { id: 'van_luggage', label: 'Luggage Capacity (bags)', type: 'number', required: true },
              { 
                id: 'van_features', 
                label: 'Features', 
                type: 'multi-select', 
                required: false, 
                options: ['Air Conditioning', 'WiFi', 'Child Seat', 'Large Luggage Space', 'Wheelchair Accessible']
              }
            ],
            'Luxury Car': [
              { id: 'luxuryCar_capacity', label: 'Seating Capacity', type: 'number', required: true },
              { id: 'luxuryCar_luggage', label: 'Luggage Capacity (bags)', type: 'number', required: true },
              { 
                id: 'luxuryCar_features', 
                label: 'Features', 
                type: 'multi-select', 
                required: false, 
                options: ['Leather Seats', 'Air Conditioning', 'WiFi', 'Complimentary Drinks', 'Phone Charger']
              }
            ],
            Bus: [
              { id: 'bus_capacity', label: 'Seating Capacity', type: 'number', required: true },
              { id: 'bus_luggage', label: 'Luggage Capacity (bags)', type: 'number', required: true },
              { 
                id: 'bus_facilities', 
                label: 'Onboard Facilities', 
                type: 'multi-select', 
                required: false, 
                options: ['Air Conditioning', 'Reclining Seats', 'WiFi', 'Toilet', 'Overhead Storage']
              }
            ]
          }
        },
        { id: 'capacity', label: 'Passenger Capacity', type: 'number', required: true },
        { id: 'coverage', label: 'Service Area / Coverage', type: 'textarea', required: true },
        { id: 'pricing', label: 'Pricing Model', type: 'select', required: true, options: ['Fixed Rate', 'Per KM', 'Hourly'] },

        { id: 'airport', label: 'Supported Airports', type: 'textarea', required: true },
        { id: 'availability', label: 'Availability (24/7?)', type: 'boolean', required: false },
        { id: 'paymentMethods', label: 'Accepted Payment Methods', type: 'multi-select', required: false, options: ['Cash', 'Credit Card', 'Mobile Money'] },

        { id: 'photos', label: 'Vehicle Photos', type: 'file', required: true, multiple: true }
      ]
    }
  ],
  name: ''
}
,

 // ==========================
// Airplane Travels
// ==========================
{
  id: 'flights',
  title: 'Airplane Travels',
  description: 'Flight services and air travel arrangements',
  icon: 'Plane',
  gradient: 'from-sky-500 to-cyan-500',
  subcategories: [
    {
      id: 'charter-flights',
      title: 'Charter Flights',
      description: 'Private and charter flight services',
      fields: [
        { id: 'serviceName', label: 'Service Name', type: 'text', required: true },
        {
          id: 'aircraftType',
          label: 'Aircraft Type',
          type: 'multi-select',
          required: true,
          options: ['Jet', 'Propeller', 'Helicopter', 'Charter', 'Other'],
          dynamicFields: {
            Jet: [
              { id: 'jet_capacity', label: 'Passenger Capacity', type: 'number', required: true },
              { id: 'jet_range', label: 'Flight Range (km)', type: 'number', required: true },
              {
                id: 'jet_features',
                label: 'Jet Features',
                type: 'multi-select',
                required: false,
                options: ['WiFi', 'Luxury Seating', 'Onboard Bar', 'Entertainment System']
              }
            ],
            Propeller: [
              { id: 'prop_capacity', label: 'Passenger Capacity', type: 'number', required: true },
              { id: 'prop_range', label: 'Flight Range (km)', type: 'number', required: true },
              {
                id: 'prop_features',
                label: 'Propeller Plane Features',
                type: 'multi-select',
                required: false,
                options: ['Short Runway Capable', 'Cargo Hold', 'Economy Seating']
              }
            ],
            Helicopter: [
              { id: 'heli_capacity', label: 'Passenger Capacity', type: 'number', required: true },
              { id: 'heli_range', label: 'Flight Range (km)', type: 'number', required: true },
              {
                id: 'heli_features',
                label: 'Helicopter Features',
                type: 'multi-select',
                required: false,
                options: ['VIP Seating', 'Panoramic Windows', 'Noise-Canceling Headsets']
              }
            ],
            Charter: [
              { id: 'charter_capacity', label: 'Passenger Capacity', type: 'number', required: true },
              { id: 'charter_flexibility', label: 'Customizable Routes?', type: 'boolean', required: false },
              {
                id: 'charter_features',
                label: 'Charter Features',
                type: 'multi-select',
                required: false,
                options: ['Flexible Scheduling', 'Onboard Catering', 'Ground Transfers']
              }
            ],
            Other: [
              { id: 'other_aircraft_type', label: 'Specify Aircraft Type', type: 'text', required: true },
              { id: 'other_capacity', label: 'Passenger Capacity', type: 'number', required: false }
            ]
          }
        },
        { id: 'routes', label: 'Available Routes', type: 'textarea', required: true },
        { id: 'services', label: 'Additional Services', type: 'textarea', required: true },

        {
          id: 'pricingModel',
          label: 'Pricing Model',
          type: 'select',
          required: true,
          options: ['Per Hour', 'Per Route', 'Custom Quote'],
          dynamicFields: {
            'Per Hour': [
              { id: 'rate_per_hour', label: 'Rate per Hour (USD)', type: 'number', required: true },
              { id: 'min_hours', label: 'Minimum Hours Required', type: 'number', required: false }
            ],
            'Per Route': [
              { id: 'route_price', label: 'Price per Route (USD)', type: 'number', required: true },
              { id: 'route_conditions', label: 'Route Conditions / Notes', type: 'textarea', required: false }
            ],
            'Custom Quote': [
              { id: 'custom_quote_details', label: 'How to Request a Quote', type: 'textarea', required: true, placeholder: 'E.g., contact details, email, phone...' }
            ]
          }
        },

        { id: 'photos', label: 'Aircraft Photos', type: 'file', required: true, multiple: true }
      ]
    }
  ],
  name: ''
},


// ==========================
// Restaurants
// ==========================
{
  id: 'restaurants',
  title: 'Restaurants',
  description: 'Dining experiences and culinary services',
  icon: 'UtensilsCrossed',
  gradient: 'from-orange-500 to-red-500',
  baseFields: [
    { id: 'restaurantName', label: 'Restaurant Name', type: 'text', required: true },
    { id: 'location', label: 'Location / Address', type: 'text', required: true },
    { id: 'openingHours', label: 'Opening Hours', type: 'text', required: true },
    { id: 'priceRange', label: 'Price Range', type: 'select', required: false, options: ['$', '$$', '$$$', '$$$$'] },
    { id: 'photos', label: 'Restaurant Photos', type: 'file', required: true, multiple: true }
  ],
  subcategories: [
    {
      id: 'fine-dining',
      title: 'Fine Dining',
      description: 'Upscale restaurant experiences',
      fields: [
        { id: 'cuisine', label: 'Cuisine Type', type: 'multi-select', required: true, options: ['Continental', 'Local', 'Asian', 'Italian', 'French', 'Other'] },
        { id: 'seating', label: 'Seating Capacity', type: 'number', required: true },
        { id: 'dressCode', label: 'Dress Code', type: 'select', required: true, options: ['Casual', 'Smart Casual', 'Business', 'Formal'] },
        { id: 'specialties', label: 'Signature Dishes', type: 'textarea', required: true }
      ]
    },
    {
      id: 'local-cuisine',
      title: 'Local Cuisine',
      description: 'Traditional and local food experiences',
      fields: [
        { id: 'localDishes', label: 'Traditional Dishes', type: 'textarea', required: true },
        { id: 'ingredients', label: 'Local Ingredients', type: 'textarea', required: true },
        { id: 'experience', label: 'Cultural Experience', type: 'textarea', required: true },
        { id: 'seating', label: 'Seating Style', type: 'multi-select', required: true, options: ['Traditional Floor', 'Regular Tables', 'Outdoor', 'Mixed'] }
      ]
    },
    {
      id: 'cafes',
      title: 'Cafés & Coffee Shops',
      description: 'Casual coffee, tea, and snack spots',
      fields: [
        { id: 'cafeType', label: 'Café Style', type: 'select', required: true, options: ['Coffee House', 'Bakery Café', 'Tea House', 'Hybrid'] },
        { id: 'menuHighlights', label: 'Menu Highlights', type: 'textarea', required: true },
        { id: 'seating', label: 'Seating Capacity', type: 'number', required: true }
      ]
    },
    {
      id: 'street-food',
      title: 'Street Food & Food Stalls',
      description: 'Casual street-side dining and local snacks',
      fields: [
        { id: 'stallType', label: 'Stall Type', type: 'select', required: true, options: ['Food Truck', 'Market Stall', 'Pop-up Stand'] },
        { id: 'popularItems', label: 'Popular Items', type: 'textarea', required: true },
        { id: 'dietaryOptions', label: 'Dietary Options', type: 'multi-select', required: false, options: ['Vegan', 'Vegetarian', 'Halal', 'Gluten-Free', 'None'] }
      ]
    }
  ],
  name: ''
}
,

  // ==========================
  // Spa & Wellness
  // ==========================
 {
  id: 'spa',
  title: 'Spa & Wellness',
  description: 'Wellness, spa, and relaxation services',
  icon: 'Sparkles',
  gradient: 'from-pink-500 to-purple-500',
  subcategories: [
    {
      id: 'wellness-spa',
      title: 'Wellness Spa',
      description: 'Full-service spa and wellness center',
      fields: [
        // 🔑 Basic Info
        { id: 'spaName', label: 'Spa Name', type: 'text', required: true },
        { id: 'treatments', label: 'Treatment Menu', type: 'textarea', required: true, placeholder: 'Massage, Facial, Aromatherapy...' },
        { id: 'specialties', label: 'Signature Treatments', type: 'textarea', required: true },

        // 🏛️ Facilities & Staff
        { id: 'facilities', label: 'Facilities', type: 'multi-select', required: true, 
          options: ['Sauna', 'Steam Room', 'Jacuzzi', 'Pool', 'Yoga Studio', 'Other'] },
        { id: 'therapists', label: 'Number of Therapists', type: 'number', required: true },

        // 📍 Logistics
        { id: 'location', label: 'Location / Address', type: 'text', required: true },
        { id: 'openingHours', label: 'Opening Hours', type: 'text', required: true },
        { id: 'priceRange', label: 'Price Range', type: 'select', required: false, options: ['$', '$$', '$$$'] },

        // 🖼️ Media
        { id: 'photos', label: 'Spa Photos', type: 'file', required: true, multiple: true }
      ]
    }
  ],
  name: ''
}

];


import apiService from '../services/apiService';

// Single fetch function
export async function fetchBusinessCategories(): Promise<BusinessCategory[]> {
  const response: any = await apiService().sendPostToServer('admin/businessTypes', {});
  let categories: BusinessCategory[] = [];

  if (response?.data) {
    categories = response.data;
  } else if (response?.returnObject) {
    categories = response.returnObject;
  }

  // Enrich each category with its frontend subcategories, icon, gradient, and description
  return categories.map(cat => {
    // Match by id (preferred) or fallback to name/title (case-insensitive)
    const frontendCat = frontendBusinessCategories.find(
      f => String(f.id) === String(cat.id) || (f.title && cat.name && f.title.toLowerCase() === String(cat.name).toLowerCase())
    );

    // Merge backend subcategories with frontend subcategories (by id)
    let mergedSubcategories: any[] = [];
    if (Array.isArray(cat.subcategories) && Array.isArray(frontendCat?.subcategories)) {
      mergedSubcategories = cat.subcategories.map((backendSub: any) => {
        const frontendSub = frontendCat?.subcategories?.find((fsub: any) => String(fsub.id) === String(backendSub.id));
        // Merge fields: prefer backend fields if present, else use frontend fields
        return {
          ...backendSub,
          fields: Array.isArray(backendSub.fields) && backendSub.fields.length > 0
            ? backendSub.fields
            : frontendSub?.fields || []
        };
      });
      // Add any frontend subcategories not present in backend
      frontendCat.subcategories.forEach((fsub: any) => {
        if (!mergedSubcategories.some((msub: any) => String(msub.id) === String(fsub.id))) {
          mergedSubcategories.push(fsub);
        }
      });
    } else if (Array.isArray(frontendCat?.subcategories)) {
      mergedSubcategories = frontendCat.subcategories;
    } else {
      mergedSubcategories = cat.subcategories || [];
    }

    return {
      ...cat,
      id: String(cat.id),
      icon: frontendCat?.icon || cat.icon,
      gradient: frontendCat?.gradient || cat.gradient,
      description: frontendCat?.description || cat.description,
      subcategories: mergedSubcategories
    };
  });
}