import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiService from '../../services/apiService';

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'newPassword') {
      setPasswordStrength(getPasswordStrength(value));
      if (!validatePassword(value)) {
        setPasswordError('Password must be at least 8 characters and include a letter, a number, and a symbol.');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;
      const response = await apiService().sendPostToServer('auth/change-password', {
        userId,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      }) as { returnCode: number; returnMessage?: string };

      if (response.returnCode === 200) {
        toast.success('Password changed successfully!');
        navigate('/');
      } else {
        toast.error(response.returnMessage || 'Failed to change password');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error changing password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      backgroundImage: `url(${process.env.PUBLIC_URL + '/backgroundsimages/waterfall.jpg'})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="w-full max-w-4xl backdrop-blur-lg bg-white/20 rounded-2xl shadow-xl overflow-hidden border border-white/30 relative">
        <div className="md:flex">
          {/* Left side - Branding */}
          <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-[#0079C1]/90 via-[#00AEEF]/90 to-[#7ED321]/90 p-8 text-white">
            <div className="flex flex-col h-full justify-between">
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full shadow-lg p-2 mb-6 flex items-center justify-center" style={{ width: '80px', height: '80px' }}>
                  <img 
                    src={process.env.PUBLIC_URL + '/logo/egret other-04.png'} 
                    alt="Egret Hospitality Logo" 
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white">Change Your Password</h2>
                <p className="text-white">
                  For your security, please set a new password.
                </p>
              </div>
              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <div className="bg-[#00AEEF] rounded-full p-2 mr-3">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <span>Secure password change</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-[#00AEEF] rounded-full p-2 mr-3">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <span>Privacy guaranteed</span>
                </div>
              </div>
            </div>
          </div>
          {/* Right side - Form */}
          <div className="md:w-2/3 p-8 backdrop-blur-sm bg-white/10 flex flex-col items-center justify-center min-h-full">
            <div className="w-full max-w-md text-center mb-8">
              <h2 className="text-3xl font-bold text-[#0079C1]">Change Password</h2>
              <p className="text-gray-900 mt-2">
                Enter your current password and choose a new one.
              </p>
            </div>
            <form className="space-y-6 w-full max-w-md" onSubmit={handleSubmit}>
              {/* Current Password Input */}
              <div className="space-y-1">
                <label htmlFor="oldPassword" className="block text-sm font-medium text-[#0079C1]">
                  <span className="text-[#22c55e] font-bold">Current Password</span>
                </label>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  required
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className="block w-full pl-4 pr-4 py-2 bg-transparent border border-white/60 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] sm:text-sm text-gray-900 placeholder-gray-600 backdrop-blur"
                  placeholder="••••••••"
                />
              </div>
              {/* New Password Input */}
              <div className="space-y-1">
                <label htmlFor="newPassword" className="block text-sm font-medium text-[#0079C1]">
                  <span className="text-[#22c55e] font-bold">New Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-6 w-6 text-green-700 font-bold" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    className={`block w-full pl-10 pr-10 py-2 bg-transparent border ${passwordError ? 'border-red-400' : 'border-white/60'} rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] sm:text-sm text-gray-900 placeholder-gray-600 backdrop-blur`}
                    placeholder="••••••••"
                    value={formData.newPassword}
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
                    onClick={() => setShowNewPassword(v => !v)}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {/* Password strength meter */}
                {formData.newPassword && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`text-xs font-semibold ${passwordStrength === 'Strong' ? 'text-green-600' : passwordStrength === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>{passwordStrength} password</span>
                    <div className="w-24 h-1 bg-gray-200 rounded">
                      <div
                        className={`h-1 rounded transition-all duration-300 ${
                          passwordStrength === 'Strong' ? 'bg-green-500 w-full' :
                          passwordStrength === 'Medium' ? 'bg-yellow-400 w-2/3' :
                          formData.newPassword ? 'bg-red-500 w-1/3' : 'bg-gray-200 w-0'
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
              {/* Confirm New Password Input */}
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#0079C1]">
                  <span className="text-[#22c55e] font-bold">Confirm New Password</span>
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
                    className="block w-full pl-10 pr-10 py-2 bg-transparent border border-white/60 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] sm:text-sm text-gray-900 placeholder-gray-600 backdrop-blur"
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
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] hover:from-[#00AEEF] hover:to-[#0079C1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00AEEF] disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
            {/* Powered by footer */}
            <div className="w-full flex flex-col items-center justify-center py-4 px-2 text-center bg-transparent">
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
    </div>
  );
};

export default ChangePasswordPage;
