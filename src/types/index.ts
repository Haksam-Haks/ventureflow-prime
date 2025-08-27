export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  isBusiness: any;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface AuthResponse {
  storedUser: UserDto;
  token: string;
  user: UserDto;
}

export interface UserDto {
  isDefaultPassword: boolean;
  id: number;
  is_active?: boolean;
  address?: string;
  city?: string;
  country?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  phone_number?: string;
  postal_code?: string;
  role: 'USER' | 'ADMIN' | 'BUSINESS_OWNER';
  username?: string;
  is_verified?: boolean;
  verification_code?: string;
  verification_code_expiry?: string;
  business_id?: number;
  created_at?: string;
  full_name?: string;
  status?: string;
  isBusiness?: boolean;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  imageUrl: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  price: number;
  location: string;
  duration: string;
  imageUrl: string;
  category: 'wildlife' | 'adventure' | 'cultural';
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  openingHours: string;
  imageUrl: string;
  priceRange: string;
}

export interface Booking {
  id: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  roomType: string;
  activities: string[];
  totalPrice: number;
}

// Generic Response Types
export interface GenericResponse<T = any> {
  user: any;
  storedUser: any;
  token: string;
  returnCode: number;
  returnMessage: string;
  returnData: T;
}

export interface SimpleResponse {
  returnCode: number;
  returnMessage: string;
}