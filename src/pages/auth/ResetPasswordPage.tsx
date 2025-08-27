import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiService from '../../services/apiService';
import { Lock, ArrowRight, ArrowLeft, Key, Building, Home } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link');
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiService().sendPostToServerWithOutToken('auth/reset-password', {
        token,
        newPassword: formData.newPassword,
      }) as {
        returnCode: number;
        returnMessage?: string;
      };
      if (response.returnCode === 200) {
        toast.success(response.returnMessage || 'Password reset successfully');
        navigate('/login');
      } else if (response.returnCode === 400 && response.returnMessage === 'Reset token has already been used') {
        toast.error('Reset token has already been used');
      } else if (response.returnCode === 400 && response.returnMessage === 'Reset token has expired') {
        toast.error('Reset token has expired');
      } else if (response.returnCode === 400 && response.returnMessage === 'Invalid or expired reset token') {
        toast.error('Invalid or expired reset token');
      } else {
        toast.error(response.returnMessage || 'Failed to reset password');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!token) {
    return null;
  }

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
              <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
              <p className="text-white/90">Set a new password for your account.</p>
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
          <div className="md:w-2/3 p-8 backdrop-blur-sm bg-white/10 flex flex-col justify-center">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-bold" style={{ color: '#0079C1' }}>Reset your password</h2>
              <p className="text-gray-100/90 mt-2">
                Please enter your new password below
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* ...existing code for form fields and buttons... */}
              <div className="space-y-1">
                <label htmlFor="newPassword" className="block text-sm font-medium text-black">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-6 w-6 text-green-700 font-bold" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    minLength={8}
                    className="block w-full pl-10 pr-3 py-2 bg-white/80 border border-white/60 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 sm:text-sm text-gray-900 placeholder-gray-600 backdrop-blur"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
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
                    type="password"
                    required
                    minLength={8}
                    className="block w-full pl-10 pr-3 py-2 bg-white/80 border border-white/60 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 sm:text-sm text-gray-900 placeholder-gray-600 backdrop-blur"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
              <div className="text-sm text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-medium text-teal-200 hover:text-white inline-flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </button>
              </div>
            </form>
            {/* Footer inside right card, right-aligned */}
            <footer className="w-full flex justify-end mt-6">
              <div className="flex flex-col md:flex-row justify-end items-end gap-2 text-xs text-gray-200/80">
                <span>Powered by</span>
                <a href="https://nepserv.com" target="_blank" rel="noopener noreferrer" className="text-[#00AEEF] hover:text-[#0079C1] font-semibold underline">Nepserv Consults Ltd</a>
                <span className="hidden md:inline">|</span>
                <a href="/privacy" className="text-gray-300 hover:text-white underline">Privacy Policy</a>
                <span className="hidden md:inline">|</span>
                <a href="/terms" className="text-gray-300 hover:text-white underline">Terms</a>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;