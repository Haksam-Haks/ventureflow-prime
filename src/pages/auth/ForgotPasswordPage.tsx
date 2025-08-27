import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiService from '../../services/apiService';
import { Mail, ArrowLeft, ArrowRight, Key, Building, Home } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      type ForgotPasswordResponse = {
        returnCode: number;
        returnMessage?: string;
      };
      const response = await apiService().sendPostToServer('auth/forgot-password', { email }) as ForgotPasswordResponse;
      if (response.returnCode === 200) {
        setIsSubmitted(true);
        toast.success(response.returnMessage || 'Password reset email sent successfully!');
      } else if (response.returnCode === 404) {
        toast.error('User not found');
      } else {
        toast.error(response.returnMessage || 'Failed to send reset email');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  // Success message after submit
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="w-full max-w-2xl backdrop-blur-lg bg-white/20 rounded-2xl shadow-xl overflow-hidden border border-white/30">
          <div className="md:flex">
            {/* Left side - Branding */}
            <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-teal-500/80 to-blue-600/80 p-8 text-white">
              <div className="flex flex-col h-full justify-between items-center">
                <div className="bg-white rounded-full shadow-lg p-2 mb-6 flex items-center justify-center" style={{ width: '80px', height: '80px' }}>
                  <img src={process.env.PUBLIC_URL + '/logo/egret other-04.png'} alt="Egret Hospitality Logo" className="h-16 w-16 object-contain" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Password Reset</h2>
                <p className="text-white/90">We'll help you get back in!</p>
                <div className="mt-8">
                  <div className="flex items-center mb-4">
                    <div className="bg-white/20 rounded-full p-2 mr-3 backdrop-blur-sm">
                      <Key className="h-5 w-5 text-white" />
                    </div>
                    <span>Secure recovery</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="bg-white/20 rounded-full p-2 mr-3 backdrop-blur-sm">
                      <Building className="h-5 w-5 text-white" />
                    </div>
                    <span>Business support</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-white/20 rounded-full p-2 mr-3 backdrop-blur-sm">
                      <Home className="h-5 w-5 text-white" />
                    </div>
                    <span>Personalized help</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Right side - Success message */}
            <div className="md:w-2/3 p-8 backdrop-blur-sm bg-white/10 flex flex-col justify-center items-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 text-center">Check your email</h2>
              <p className="mt-4 text-black text-center">
                We've sent password reset instructions to <span className="font-medium text-green-600">{email}</span>
              </p>
              <div className="mt-6 space-y-4 w-full flex flex-col items-center">
                <Link
                  to="/login"
                  className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Return to login
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="text-center text-sm text-gray-500">
                  Didn't receive the email?{' '}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="font-medium text-teal-700 hover:text-green-600 underline"
                  >
                    Try again
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="w-full max-w-4xl mx-auto mt-8 mb-2 text-center text-xs text-gray-200/80">
          <div className="flex flex-col md:flex-row justify-center items-center gap-2">
            <span>Powered by</span>
            <a href="https://nepserv.com" target="_blank" rel="noopener noreferrer" className="text-[#00AEEF] hover:text-[#0079C1] font-semibold underline">Nepserv Consults Ltd</a>
            <span className="hidden md:inline">|</span>
            <a href="/privacy" className="text-gray-300 hover:text-white underline">Privacy Policy</a>
            <span className="hidden md:inline">|</span>
            <a href="/terms" className="text-gray-300 hover:text-white underline">Terms</a>
          </div>
        </footer>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="w-full max-w-4xl backdrop-blur-lg bg-white/20 rounded-2xl shadow-xl overflow-hidden border border-white/30">
        <div className="md:flex">
          {/* Left side - Branding */}
          <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-[#0079C1]/90 via-[#00AEEF]/90 to-[#7ED321]/90 p-8 text-white">
            <div className="flex flex-col h-full justify-between items-center">
              <div className="bg-white rounded-full shadow-lg p-2 mb-6 flex items-center justify-center" style={{ width: '80px', height: '80px' }}>
                <img src="src/logo/egret other-04.png" alt="Egret Hospitality Logo" className="h-16 w-16 object-contain" />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#0079C1' }}>Password Reset</h2>
              <p className="text-white/90">We'll help you get back in!</p>
              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <div className="bg-white/20 rounded-full p-2 mr-3 backdrop-blur-sm">
                    <Key className="h-5 w-5 text-white" />
                  </div>
                  <span>Secure recovery</span>
                </div>
                <div className="flex items-center mb-4">
                  <div className="bg-white/20 rounded-full p-2 mr-3 backdrop-blur-sm">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <span>Business support</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full p-2 mr-3 backdrop-blur-sm">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <span>Personalized help</span>
                </div>
              </div>
            </div>
          </div>
          {/* Right side - Form */}
          <div className="md:w-2/3 p-8 backdrop-blur-sm bg-white/10">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-bold" style={{ color: '#0079C1' }}>Forgot password?</h2>
              <p className="text-gray-100/90 mt-2">
                Enter your email and we'll send you reset instructions
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-black">
                  Email address
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
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
                      Sending...
                    </>
                  ) : (
                    <>
                      Send reset instructions
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
              <div className="text-sm text-center">
                <Link
                  to="/login"
                  className="font-medium text-teal-200 hover:text-white inline-flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto mt-8 mb-2 text-center text-xs text-gray-200/80">
        <div className="flex flex-col md:flex-row justify-center items-center gap-2">
          <span>Powered by</span>
          <a href="https://nepserv.com" target="_blank" rel="noopener noreferrer" className="text-[#00AEEF] hover:text-[#0079C1] font-semibold underline">Nepserv Consults Ltd</a>
          <span className="hidden md:inline">|</span>
          <a href="/privacy" className="text-gray-300 hover:text-white underline">Privacy Policy</a>
          <span className="hidden md:inline">|</span>
          <a href="/terms" className="text-gray-300 hover:text-white underline">Terms</a>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;