import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "./components/ui/tooltip";
import { UserProvider } from './contexts/UserContext';
import { BusinessProvider } from './contexts/BusinessContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from "./components/layout/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import PrivateRoute from './components/PrivateRoute';

// Authentication Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';

// Customer Pages
import Index from "./pages/index.tsx";
import NotFound from "./pages/NotFound";
import PricingPage from "./pages/PricingPage";
import AccountPage from "./pages/account/AccountPage";
import ProfilePage from "./pages/account/ProfilePage";
import SettingsPage from "./pages/account/SettingsPage";
import BookingsPage from "./pages/account/BookingsPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import DestinationsPage from "./pages/DestinationsPage";
import HotelsPage from "./pages/HotelsPage";
import ContactPage from "./pages/ContactPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import RestaurantListing from "./pages/restaurants/RestaurantListing";
import RestaurantDetailPage from "./pages/restaurants/RestaurantDetailPage";
import WildlifeTours from "./pages/tours/WildlifeTours";

// Business Pages
import BusinessRegistrationForm from './pages/business/BusinessRegistrationForm';
import BusinessDashboard from './pages/business/Business/BusinessDashboard';
// import Dashboard from './pages/business/Business/Dashboard';
import ListingCreation from './pages/business/Business/ListingCreation';
import PackageSelection from './pages/business/Business/PackageSelection';
import SubcategorySelection from './pages/business/Business/SubcategorySelection';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import BusinessApprovals from './pages/admin/BusinessApprovals';
import AdminUsers from './pages/admin/Users';
import AdminBusinesses from './pages/admin/Businesses';
import AdminBookings from './pages/admin/Bookings';
import AdminTransactions from './pages/admin/Transactions';
import AdminSettings from './pages/admin/Settings';
import ListingDetailPage from "./pages/admin/ListingDetailPage.tsx";
import ListingApprovals from "./pages/admin/ListingApprovals.tsx";
import UnauthorizedPage from './pages/UnauthorizedPage';
import BusinessDetailPage from './pages/admin/business-detail/BusinessDetailPage';
import MasterDataManagementPage from './pages/admin/MasterDataManagementPage';
import ApprovedBusinesses from './pages/admin/ApprovedBusinesses';

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  // Save last visited path on every route change
  React.useEffect(() => {
    localStorage.setItem('lastPath', location.pathname);
  }, [location.pathname]);

  // On mount, redirect to lastPath if present and not already there
  React.useEffect(() => {
    const lastPath = localStorage.getItem('lastPath');
    if (lastPath && lastPath !== location.pathname && location.pathname === '/') {
      navigate(lastPath, { replace: true });
    }
  }, []);

  return (
      <AuthProvider>
        <UserProvider>
          <BusinessProvider>
            <TooltipProvider>
              <div className="min-h-screen flex flex-col bg-gray-50">
                <Layout>
                  <main className="flex-grow">
                    <ErrorBoundary>
                      <Routes>
                        {/* Public Routes */}
                          <Route path="/" element={<Index />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/destinations" element={<DestinationsPage />} />
                        <Route path="/hotels" element={<HotelsPage />} />

                        {/* Authentication Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/verify-email" element={<VerifyEmailPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/change-password" element={<ChangePasswordPage />} />

                        {/* Customer Routes (USER only) */}
                        <Route element={<PrivateRoute allowedRoles={['USER']} />}>
                          <Route path="/account" element={<AccountPage />} />
                          <Route path="/account/profile" element={<ProfilePage />} />
                          <Route path="/account/settings" element={<SettingsPage />} />
                          <Route path="/account/bookings" element={<BookingsPage />} />
                        </Route>
                        {/* Public Business Registration Route */}
                        <Route path="/business/register" element={<BusinessRegistrationForm />} />
                        {/* Pricing Page Route */}
                        <Route path="/pricingpage" element={<PricingPage />} />
                        <Route path="/dashboard/:categoryId" element={<BusinessDashboard />} />
                        <Route path="/dashboard/:categoryId/subcategory" element={<SubcategorySelection />} />
                        <Route path="/dashboard/:categoryId/listing/new" element={<ListingCreation />} />
                        <Route path="/dashboard/:categoryId/package" element={<PackageSelection />} />
                        {/* Admin Routes (ADMIN only) */}
                        <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
                          <Route path="/admin" element={<AdminDashboard />}>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<div>Dashboard Content</div>} />
                            <Route path="approved-businesses" element={<ApprovedBusinesses />} />
                            <Route path="approvals" element={<BusinessApprovals />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="businesses" element={<AdminBusinesses />} />
                            <Route path="businesses/:id" element={<BusinessDetailPage />} />
                            <Route path="bookings" element={<AdminBookings />} />
                            <Route path="transactions" element={<AdminTransactions />} />
                            <Route path="settings" element={<AdminSettings />} />
                            <Route path="listing-approvals" element={<ListingApprovals />} />
                            <Route path="listing/:id" element={<ListingDetailPage />} />
                            <Route path="banks" element={<MasterDataManagementPage />} />
                          </Route>
                        </Route>

                        {/* Other public routes */}
                        <Route path="/hotels/:id" element={<HotelDetailPage />} />
                        <Route path="/wildlife" element={<WildlifeTours />} />
                        <Route path="/restaurants" element={<RestaurantListing />} />
                        <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
                        <Route path="/activities" element={<ActivitiesPage />} />

                        {/* Unauthorized Route */}
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />

                        {/* Catch All */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </ErrorBoundary>
                  </main>
                </Layout>
              </div>
            </TooltipProvider>
          </BusinessProvider>
        </UserProvider>
      </AuthProvider>
  );
}

function App() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <Router>
            <AppRoutes />
          </Router>
          <Toaster position="top-center" reverseOrder={false} />
        </ErrorBoundary>
      </QueryClientProvider>
    </div>
  );
}

export default App;
