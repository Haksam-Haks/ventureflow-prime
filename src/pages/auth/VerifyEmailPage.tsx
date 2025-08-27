import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiService from '../../services/apiService';
import { Key, Building, Home, ArrowLeft } from 'lucide-react';
import VerificationCodeInput from './VerificationCodeInput';

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsResending] = useState(false);
  const [verificationError, setVerificationError] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error('No email provided for verification.');
      navigate('/login');
    }
  }, [email, navigate]);

  const handleVerification = async (code: string) => {
    setError('');
    setVerificationError(false);
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('verificationCode', code);
      const response = await apiService().sendPostToServerWithOutToken(
        'auth/verify-email',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      ) as {
        returnCode: number;
        returnMessage: string;
      };
      if (response.returnCode === 200) {
        toast.success(response.returnMessage);
        navigate('/login');
      } else {
        setError(response.returnMessage);
        setVerificationError(true);
        toast.error(response.returnMessage);
      }
    } catch (err: any) {
      setError(err.message);
      setVerificationError(true);
      toast.error(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const params = new URLSearchParams();
      params.append('email', email);
      const response = await apiService().sendPostToServerWithOutToken(
        'auth/resend-verification',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      ) as {
        returnCode: number;
        returnMessage: string;
      };
      if (response.returnCode === 200) {
        toast.success(response.returnMessage);
        setVerificationError(false);
        setError('');
      } else {
        toast.error(response.returnMessage);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="w-full max-w-4xl backdrop-blur-lg bg-white/20 rounded-2xl shadow-xl overflow-hidden border border-white/30">
        <div className="md:flex">
          {/* Left side - Branding */}
          <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-teal-500/80 to-blue-600/80 p-8 text-white">
            <div className="flex flex-col h-full justify-between items-center">
              <div className="bg-white rounded-full shadow-lg p-2 mb-6 flex items-center justify-center" style={{ width: '80px', height: '80px' }}>
                <img src={process.env.PUBLIC_URL + '/logo/egret other-04.png'} alt="Egret Hospitality Logo" className="h-16 w-16 object-contain" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Verify Email</h2>
              <p className="text-white/90">Secure your account and unlock features.</p>
              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <div className="bg-white/20 rounded-full p-2 mr-3 backdrop-blur-sm">
                    <Key className="h-5 w-5 text-white" />
                  </div>
                  <span>2FA Security</span>
                </div>
                <div className="flex items-center mb-4">
                  <div className="bg-white/20 rounded-full p-2 mr-3 backdrop-blur-sm">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <span>Business options</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full p-2 mr-3 backdrop-blur-sm">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <span>Personalized access</span>
                </div>
              </div>
            </div>
          </div>
          {/* Right side - Form */}
          <div className="md:w-2/3 p-8 bg-gradient-to-br from-[#0079C1]/80 via-[#00AEEF]/60 to-[#7ED321]/60 backdrop-blur-lg flex flex-col justify-center">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-bold" style={{ color: '#0079C1' }}>Verify your email</h2>
              <p className="text-gray-100/90 mt-2">
                We've sent a verification code to <span className="font-medium text-white/90">{email}</span>
              </p>
            </div>
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 rounded-lg border border-red-400/30 backdrop-blur-sm">
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}
            <div className="mt-6 space-y-6">
              <VerificationCodeInput
                onComplete={handleVerification}
                disabled={isLoading}
                error={verificationError}
                errorMessage={error}
                email={email}
                onResend={handleResendCode}
              />
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-teal-200 hover:text-white underline"
                >
                  <ArrowLeft className="h-4 w-4 mr-1 inline" />
                  Back to login
                </button>
              </div>
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
    </div>
  );
};

export default VerifyEmailPage;