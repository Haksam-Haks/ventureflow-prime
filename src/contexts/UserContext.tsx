import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useCallback } from 'react';
import { apiService } from '../services/apiService';

interface User {
  profile: any;
  full_name?: string;
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  businessId?: string;
  role: 'USER' | 'ADMIN' | 'BUSINESS_OWNER' | 'BUSINESS_STAFF';
  isBusiness?: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null | ((prev: User | null) => User | null)) => void;
  isAuthenticated: boolean;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        localStorage.removeItem('user');
        setUserState(null);
      }
    } else {
      setUserState(null);
    }
    setIsLoading(false);
  }, []);


  const setUser = (value: User | null | ((prev: User | null) => User | null)) => {
    setUserState((prev) => {
      let newValue = typeof value === 'function' ? value(prev) : value;
      if (!newValue) {
        localStorage.removeItem('user');
      } else {
        localStorage.setItem('user', JSON.stringify(newValue));
      }
      return newValue;
    });
  };

  const logout = useCallback(async () => {
    try {
      await apiService().sendPostToServerWithOutToken('logout', {});
    } catch (e) {
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    document.cookie = 'authToken=; Max-Age=0; path=/;';
    document.cookie = 'token=; Max-Age=0; path=/;';
    setUserState(null);
    
    if ((window as any).__REACT_QUERY_CLIENT__ && typeof (window as any).__REACT_QUERY_CLIENT__.clear === 'function') {
      (window as any).__REACT_QUERY_CLIENT__.clear();
    }
 
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated: !!user, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
