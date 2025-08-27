
import React, { createContext, useContext, useReducer, useState, useEffect, ReactNode } from 'react';

// Business object type
interface Business {
  id: string;
  name: string;
  businessName: string;
  type: string;
  status: string;
  modules?: string[];
}

// Business state for flow
export interface BusinessState {
  selectedCategoryId: string | null;
  selectedSubcategoryId: string | null;
  listingFormData: Record<string, any>;
  selectedPackage: 'basic' | 'premium' | 'gold' | null;
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    businessTypeId?: string;
  } | null;
}

type BusinessAction =
  | { type: 'SET_CATEGORY', categoryId: string }
  | { type: 'SET_SUBCATEGORY', subcategoryId: string }
  | { type: 'UPDATE_LISTING_DATA', data: Record<string, any> }
  | { type: 'SET_PACKAGE', packageType: 'basic' | 'premium' | 'gold' }
  | { type: 'LOGIN', user: BusinessState['user'] }
  | { type: 'LOGOUT' }
  | { type: 'RESET_FORM' }
  | { type: 'LOAD_STATE', state: BusinessState }
  | { type: 'START_LISTING_FLOW', categoryId: string };

const initialState: BusinessState = {
  selectedCategoryId: null,
  selectedSubcategoryId: null,
  listingFormData: {},
  selectedPackage: null,
  isAuthenticated: false,
  user: null,
};

// Load state from localStorage
const loadStateFromStorage = (): BusinessState => {
  try {
    const saved = localStorage.getItem('ventureflow-state');
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  } catch {
    return initialState;
  }
};

// Save state to localStorage
const saveStateToStorage = (state: BusinessState) => {
  try {
    localStorage.setItem('ventureflow-state', JSON.stringify(state));
  } catch {}
};

function businessReducer(state: BusinessState, action: BusinessAction): BusinessState {
  let newState: BusinessState;
  switch (action.type) {
    case 'LOAD_STATE':
      newState = action.state;
      break;
    case 'START_LISTING_FLOW':
      newState = {
        ...state,
        selectedCategoryId: action.categoryId,
        selectedSubcategoryId: null,
        listingFormData: {},
        selectedPackage: null,
      };
      break;
    case 'SET_CATEGORY':
      newState = {
        ...state,
        selectedCategoryId: action.categoryId,
        selectedSubcategoryId: null,
        listingFormData: {},
      };
      break;
    case 'SET_SUBCATEGORY':
      newState = {
        ...state,
        selectedSubcategoryId: action.subcategoryId,
        listingFormData: {},
      };
      break;
    case 'UPDATE_LISTING_DATA':
      newState = {
        ...state,
        listingFormData: { ...state.listingFormData, ...action.data },
      };
      break;
    case 'SET_PACKAGE':
      newState = {
        ...state,
        selectedPackage: action.packageType,
      };
      break;
    case 'LOGIN':
      newState = {
        ...state,
        isAuthenticated: true,
        user: action.user,
      };
      break;
    case 'LOGOUT':
      newState = initialState;
      break;
    case 'RESET_FORM':
      newState = {
        ...state,
        selectedSubcategoryId: null,
        listingFormData: {},
        selectedPackage: null,
      };
      break;
    default:
      newState = state;
  }
  if (action.type !== 'LOAD_STATE') {
    saveStateToStorage(newState);
  }
  return newState;
}

interface BusinessContextType {
  selectedCategoryId: any;
  state: BusinessState;
  dispatch: React.Dispatch<BusinessAction>;
  business: Business | null;
  setBusiness: (business: Business | null) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(businessReducer, initialState, loadStateFromStorage);
  const [business, setBusinessState] = useState<Business | null>(null);

  // Load business object from localStorage on mount
  useEffect(() => {
    const storedBusiness = localStorage.getItem('business');
    if (storedBusiness) {
      try {
        setBusinessState(JSON.parse(storedBusiness));
      } catch {
        localStorage.removeItem('business');
        setBusinessState(null);
      }
    }
  }, []);

  // Ensure categoryId is set from registration/localStorage on mount
  useEffect(() => {
    const regCatId = localStorage.getItem('ventureflow-categoryId');
    if (regCatId && !state.selectedCategoryId) {
      dispatch({ type: 'SET_CATEGORY', categoryId: regCatId });
    }
  }, [state.selectedCategoryId]);

  const setBusiness = (business: Business | null) => {
    if (business) {
      localStorage.setItem('business', JSON.stringify(business));
      setBusinessState(business);
    } else {
      localStorage.removeItem('business');
      setBusinessState(null);
    }
  };

  return (
    <BusinessContext.Provider value={{ selectedCategoryId: state.selectedCategoryId, state, dispatch, business, setBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness(): BusinessContextType {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
