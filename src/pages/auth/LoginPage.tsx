import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import{apiService}from '../../services/apiService';
import { useUser } from '../../contexts/UserContext';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (name === 'password') {
            setPasswordError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setIsLoading(true);
        try {
            const response = await apiService().sendPostToServerWithOutToken('auth/login', formData) as {
                returnCode: number;
                returnMessage?: string;
                returnData?: any;
            };
            if (
                response.returnCode === 403 &&
                (response.returnMessage?.toLowerCase().includes('business was put off') || response.returnMessage?.toLowerCase().includes('deactivated'))
            ) {
                toast.error('Business was put off, check with admin for help');
                setIsLoading(false);
                return;
            }
            if (response.returnCode === 200 && response.returnData) {
                const token = response.returnData.token;
                const userData = response.returnData.user;
                const user = {
                    ...userData,
                    id: String(userData.id), // Ensure id is a string
                    role: userData.role as "USER" | "ADMIN" | "BUSINESS_OWNER" | "BUSINESS_STAFF",
                    isBusiness: userData.isBusiness || false,
                    full_name: userData.full_name || `${userData.first_name ?? userData.first_name ?? ''} ${userData.last_name ?? userData.last_name ?? ''}`,
                    firstName: userData.first_name ?? userData.first_name ?? '',
                    lastName: userData.last_name ?? userData.last_name ?? '',
                    phoneNumber: userData.phone_number ?? userData.phone_number ?? '',
                    postalCode: userData.postal_code ?? userData.postal_code ?? '',
                    isDefaultPassword: userData.isDefaultPassword ?? false, // expect backend to provide this
                    username: userData.username ?? '', // Ensure username is always a string
                };
                setUser(user);
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.removeItem('auth');
                toast.success(response.returnMessage || 'Login successful');
                // If BUSINESS_OWNER and using default password, force change
                if (user.role === 'BUSINESS_OWNER' && user.isDefaultPassword) {
                    navigate('/change-password', { replace: true });
                    return;
                }
                if (user.role === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            } else if (response.returnCode === 403) {
                toast.error('Please verify your email before logging in');
            } else if (response.returnCode === 401) {
                toast.error('Invalid email or password');
            } else if (response.returnCode === 404) {
                toast.error('User not found');
            } else {
                toast.error(response.returnMessage || 'Login failed');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred during login. Please try again.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{
            backgroundImage: `url(${import.meta.env.BASE_URL + 'backgroundsimages/waterfall.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            <div className="w-full max-w-4xl backdrop-blur-lg bg-white/20 rounded-2xl shadow-xl overflow-hidden border border-white/30 relative">
                {/* Home button inside card, top right */}
                <div className="absolute top-4 right-4 z-10">
                    <Link to="/" className="text-[#0079C1] font-semibold underline hover:text-[#00AEEF] transition-colors flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
                        </svg>
                        Home
                    </Link>
                </div>
                <div className="md:flex">
                    {/* Left side - Branding */}
                    <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-[#0079C1]/90 via-[#00AEEF]/90 to-[#7ED321]/90 p-8 text-white">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex flex-col items-center">
                                <div className="bg-white rounded-full shadow-lg p-2 mb-6 flex items-center justify-center" style={{ width: '80px', height: '80px' }}>
                                    <img 
                                        src={import.meta.env.BASE_URL + 'logo/egret other-04.png'} 
                                        alt="Egret Hospitality Logo" 
                                        className="h-16 w-16 object-contain"
                                    />
                                </div>
                                <h2 className="text-2xl font-bold mb-2 text-white">Welcome Back</h2>
                                <p className="text-white">
                                    Sign in to access your account and explore more features.
                                </p>
                            </div>
                            <div className="mt-8">
                                <div className="flex items-center mb-4">
                                    <div className="bg-[#00AEEF] rounded-full p-2 mr-3">
                                        <Mail className="h-5 w-5 text-white" />
                                    </div>
                                    <span>Secure login</span>
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
                            <h2 className="text-3xl font-bold text-[#0079C1]">Sign In</h2>
                            <p className="text-gray-900 mt-2">
                                Don't have an account?{' '}
                                <Link 
                                    to="/register" 
                                    className="font-medium text-[#00AEEF] hover:text-[#0079C1] transition-colors underline"
                                >
                                    Register here
                                </Link>
                            </p>
                        </div>
                        <form className="space-y-6 w-full max-w-md" onSubmit={handleSubmit}>
                            {/* Email Input */}
                            <div className="space-y-1">
                                <label htmlFor="email" className="block text-sm font-medium text-[#0079C1]">
                                    <span className="text-[#22c55e] font-bold">Email address</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-8 w-8 text-[#60a5fa] font-normal" style={{ strokeWidth: 1.5 }} />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-10 py-2 bg-transparent border border-white/60 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] sm:text-sm text-gray-900 placeholder-gray-600 backdrop-blur"
                                        placeholder="your@email.com"
                                        onPaste={e => e.preventDefault()}
                                        onCopy={e => e.preventDefault()}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none cursor-default"
                                        tabIndex={-1}
                                        aria-label="Email field icon"
                                        disabled
                                        style={{ background: 'transparent', border: 'none' }}
                                    >
                                        <Mail className="h-6 w-6 text-transparent" />
                                    </button>
                                </div>
                            </div>
                            {/* Password Input */}
                            <div className="space-y-1">
                                <label htmlFor="password" className="block text-sm font-medium text-[#0079C1]">
                                    <span className="text-[#22c55e] font-bold">Password</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-8 w-8 text-[#60a5fa] font-normal" style={{ strokeWidth: 1.5 }} />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                       className={`block w-full pl-12 pr-10 py-2 bg-transparent border ${passwordError ? 'border-red-400' : 'border-white/60'} rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] sm:text-sm text-gray-900 placeholder-gray-600 backdrop-blur`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                                        tabIndex={-1}
                                        onClick={() => setShowPassword(v => !v)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                                    </button>
                                </div>
                                {passwordError && (
                                    <div className="text-xs text-red-500 mt-1">{passwordError}</div>
                                )}
                            </div>
                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-medium text-[#7ED321] hover:text-[#0079C1] underline">
                                        <span className="text-[#22c55e] font-bold underline hover:text-[#0079C1]">Forgot password?</span>
                                    </Link>
                                </div>
                            </div>
                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#0079C1] via-[#00AEEF] to-[#7ED321] hover:from-[#00AEEF] hover:to-[#0079C1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00AEEF] disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign in
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </div>
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
export default LoginPage;