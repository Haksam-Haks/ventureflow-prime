import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import{apiService}from '../../services/apiService';
import { RegisterRequest } from '../../types';
import VerificationCodeInput from './VerificationCodeInput';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Phone, MapPin, Building, Key, Home, Eye, EyeOff } from 'lucide-react';
const waterfallBg = import.meta.env.BASE_URL + 'backgroundsimages/waterfall.jpg';
const logoImage = import.meta.env.BASE_URL + 'logo/egret other-04.png';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [formData, setFormData] = useState<RegisterRequest & { confirmPassword?: string }>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    isBusiness: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiService().sendPostToServerWithOutToken('auth/register', formData);
      // Type assertion to expected response shape
      const res = response as { returnCode: number; returnMessage: string };
      if (res.returnCode === 200) {
        toast.success(res.returnMessage);
        setShowVerification(true);
      } else if (res.returnCode === 400 && res.returnMessage === 'Email already exists') {
        setError('Email already exists');
        toast.error('Email already exists');
      } else {
        setError(res.returnMessage);
        toast.error(res.returnMessage || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (code: string) => {
    setIsLoading(true);
    try {
      // Use URLSearchParams to send as form data
      const params = new URLSearchParams();
      params.append('email', formData.email);
      params.append('verificationCode', code);
      const response = await apiService().sendPostToServerWithOutToken(
        'auth/verify-email',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      const res = response as { returnCode: number; returnMessage: string };
      if (res.returnCode === 200) {
        toast.success(res.returnMessage || 'Email verified successfully!');
        if (formData.isBusiness) {
          navigate('/business/register');
        } else {
          navigate('/');
        }
      } else if (res.returnCode === 400 && res.returnMessage === 'Invalid verification code') {
        toast.error('Invalid verification code');
      } else if (res.returnCode === 400 && res.returnMessage === 'Verification code has expired') {
        toast.error('Verification code has expired');
      } else if (res.returnCode === 400 && res.returnMessage === 'Email is already verified') {
        toast.error('Email is already verified');
      } else {
        toast.error(res.returnMessage || 'Verification failed. Please try again.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('email', formData.email);
      const response = await apiService().sendPostToServerWithOutToken(
        'auth/resend-verification',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      const res = response as { returnCode: number; returnMessage: string };
      if (res.returnCode === 200) {
        toast.success(res.returnMessage || 'Verification code resent successfully!');
      } else if (res.returnCode === 400 && res.returnMessage === 'Email is already verified') {
        toast.error('Email is already verified');
      } else {
        toast.error(res.returnMessage || 'Failed to resend verification code.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Password validation: min 8 chars, at least 1 letter, 1 number, 1 symbol
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    return minLength && hasLetter && hasNumber && hasSymbol;
  };

  // Password strength meter (simple)
  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    if (score <= 2) return 'Weak';
    if (score === 3) return 'Medium';
    if (score >= 4) return 'Strong';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
      if (!validatePassword(value)) {
        setPasswordError('Password must be at least 8 characters and include a letter, a number, and a symbol.');
      } else {
        setPasswordError('');
      }
    }
  };

  if (showVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        backgroundImage: `url(${logoImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="w-full max-w-md backdrop-blur-lg bg-white/20 rounded-2xl shadow-xl overflow-hidden border border-white/30">
          <div className="p-8">
            <div className="text-center mb-8">
              <img src={logoImage}
                alt="Egret Hospitality Logo"
                className="h-14 w-auto mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-[#0079C1]">Verify Your Email</h2>
              <p className="text-[#0079C1] mt-2">
                We've sent a code to <span className="font-medium">{formData.email}</span>
              </p>
            </div>
            <VerificationCodeInput
              email={formData.email}
              onComplete={handleVerification}
              onResend={handleResendCode}
              disabled={isLoading}
            />
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowVerification(false)}
                className="text-sm font-medium text-[#0079C1] hover:text-[#00AEEF] underline transition-colors"
              >
                Back to registration
              </button>
            </div>
            {/* Powered by footer */}
            <div className="w-full flex flex-col items-center justify-center py-4 px-2 text-center bg-transparent mt-6">
              <span className="text-sm font-semibold text-[#0079C1] drop-shadow-sm mb-1">
                Powered by <span className="text-[#00AEEF]"> Nepserv Consults Ltd</span>
              </span>
              <span className="text-xs text-[#0079C1] space-x-1">
                <span>© 2025 Nepserv Consults Ltd. All rights reserved.</span>
                <a href="#" className="underline hover:text-[#00AEEF] ml-1">Terms of Use</a>
                <span className="mx-1 text-[#0079C1]">|</span>
                <a href="#" className="underline hover:text-[#00AEEF]">Privacy Policy</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      backgroundImage: `url(${waterfallBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="w-full max-w-4xl backdrop-blur-lg bg-white/20 rounded-2xl shadow-xl overflow-hidden border border-white/30">
        <div className="md:flex">
          {/* Left side - Branding */}
          <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-[#0079C1]/90 via-[#00AEEF]/90 to-[#7ED321]/90 p-8 text-white">
            <div className="flex flex-col h-full justify-between">
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full shadow-lg p-2 mb-6 flex items-center justify-center" style={{ width: '80px', height: '80px' }}>
                  <img
                    src={logoImage}
                    alt="Egret Hospitality Logo"
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white">Join Our Community</h2>
                <p className="text-white">
                  Discover amazing experiences and connect with hospitality professionals worldwide.
                </p>
              </div>
              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <div className="bg-[#00AEEF] rounded-full p-2 mr-3">
                    <Key className="h-5 w-5 text-white" />
                  </div>
                  <span>Secure account with 2FA</span>
                </div>
                <div className="flex items-center mb-4">
                  <div className="bg-[#00AEEF] rounded-full p-2 mr-3">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <span>Business account options</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-[#00AEEF] rounded-full p-2 mr-3">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <span>Personalized recommendations</span>
                </div>
              </div>
            </div>
          </div>
          {/* Right side - Form */}
          <div className="md:w-2/3 p-8 backdrop-blur-sm bg-white/10 flex flex-col items-center justify-center min-h-full">
            <div className="w-full max-w-md text-center mb-8">
              <h2 className="text-3xl font-bold text-[#0079C1]">Create Your Account</h2>
              <p className="text-gray-900 mt-2">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-[#00AEEF] hover:text-[#0079C1] transition-colors underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 rounded-lg border border-red-400/30 backdrop-blur-sm">
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-1">
                  <label htmlFor="firstName" className="block text-sm font-medium text-black">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-6 w-6 text-green-700 font-bold" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-2 bg-white/80 border border-white/60 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 sm:text-sm text-gray-900 placeholder-gray-500 backdrop-blur"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-1">
                  <label htmlFor="lastName" className="block text-sm font-medium text-black">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-6 w-6 text-green-700 font-bold" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-2 bg-white/80 border border-white/60 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 sm:text-sm text-gray-900 placeholder-gray-500 backdrop-blur"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="md:col-span-2 space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-black">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-6 w-6 text-green-700 font-bold" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full pl-10 pr-3 py-2 bg-white/80 border border-white/60 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 sm:text-sm text-gray-900 placeholder-gray-500 backdrop-blur"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-black">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-6 w-6 text-green-700 font-bold" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      className={`block w-full pl-10 pr-10 py-2 bg-white/80 border ${passwordError ? 'border-red-400' : 'border-white/60'} rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 sm:text-sm text-gray-900 placeholder-gray-500 backdrop-blur`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      onPaste={e => e.preventDefault()}
                      onCopy={e => e.preventDefault()}
                      pattern="^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$"
                      title="Password must be at least 8 characters and include a letter, a number, and a symbol."
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                      tabIndex={-1}
                      onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {/* Password strength meter */}
                  {formData.password && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`text-xs font-semibold ${passwordStrength === 'Strong' ? 'text-green-600' : passwordStrength === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>{passwordStrength} password</span>
                      <div className="w-24 h-1 bg-gray-200 rounded">
                        <div
                          className={`h-1 rounded transition-all duration-300 ${
                            passwordStrength === 'Strong' ? 'bg-green-500 w-full' :
                            passwordStrength === 'Medium' ? 'bg-yellow-400 w-2/3' :
                            formData.password ? 'bg-red-500 w-1/3' : 'bg-gray-200 w-0'
                          }`}
                        ></div>
                      </div>
                    </div>
                  )}
                  {passwordError && (
                    <div className="text-xs text-red-500 mt-1">{passwordError}</div>
                  )}
                  <p className="mt-1 text-xs text-white/60">
                    Minimum 8 characters, must include a letter, a number, and a symbol
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-6 w-6 text-green-700 font-bold" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      className="block w-full pl-10 pr-10 py-2 bg-white/80 border border-white/60 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 sm:text-sm text-gray-900 placeholder-gray-500 backdrop-blur"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onPaste={e => e.preventDefault()}
                      onCopy={e => e.preventDefault()}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPassword(v => !v)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-black">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-6 w-6 text-green-700 font-bold" />
                    </div>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      className="block w-full pl-10 pr-3 py-2 bg-white/80 border border-white/60 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 sm:text-sm text-gray-900 placeholder-gray-500 backdrop-blur"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <label htmlFor="address" className="block text-sm font-medium text-black">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-6 w-6 text-green-700 font-bold" />
                    </div>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-2 bg-white/80 border border-white/60 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 sm:text-sm text-gray-900 placeholder-gray-500 backdrop-blur"
                      placeholder="123 Main St"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label htmlFor="city" className="block text-sm font-medium text-black">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    className="block w-full px-3 py-2 bg-white/80 border border-white/60 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 sm:text-sm text-gray-900 placeholder-gray-500 backdrop-blur"
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                {/* Country */}
                <div className="space-y-1">
                  <label htmlFor="country" className="block text-sm font-medium text-black">
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    required
                    className="block w-full px-3 py-2 bg-white/80 border border-white/60 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 sm:text-sm text-gray-900 placeholder-gray-500 backdrop-blur"
                    placeholder="United States"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>

                {/* Postal Code */}
                <div className="space-y-1">
                  <label htmlFor="postalCode" className="block text-sm font-medium text-black">
                    Postal Code
                  </label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    className="block w-full px-3 py-2 bg-white/80 border border-white/60 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 sm:text-sm text-gray-900 placeholder-gray-500 backdrop-blur"
                    placeholder="10001"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Business Registration */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-transparent text-sm text-black-600">
                    Business Owners
                  </span>
                </div>
                </div>

                <div className="mt-4">
                  <Link
                    to="/business/register"
                    className="w-full flex items-center justify-center gap-3 p-3 border border-white/30 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 backdrop-blur-sm"
                  >
                    <Building className="h-5 w-5 text-white" />
                    <span className="font-medium text-green-700">Create a Business</span>
                    <span className="ml-auto bg-teal-400 text-teal-900 text-xs font-bold px-2 py-0.5 rounded-full">PRO</span>
                  </Link>
                  <p className="mt-2 text-xs text-black/60 text-center">
                    Want to list your business? Click above to get started.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
