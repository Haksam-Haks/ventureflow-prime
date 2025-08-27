import React, { useRef, useState, useEffect } from 'react';
import { Mail, RotateCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VerificationCodeInputProps {
  onComplete: (code: string) => void;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  onResend?: () => Promise<void>;
  email?: string;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  onComplete,
  disabled = false,
  error = false,
  errorMessage,
  onResend,
  email,
}) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hasSubmitted = useRef(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value) || value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length) {
      const newCode = [...code];
      for (let i = 0; i < 6; i++) {
        newCode[i] = pasted[i] || '';
      }
      setCode(newCode);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const resetCode = () => {
    setCode(Array(6).fill(''));
    hasSubmitted.current = false;
    inputRefs.current[0]?.focus();
  };

  const handleResendClick = async () => {
    if (!onResend) return;
    setIsResending(true);
    try {
      await onResend();
      toast.success('Verification code resent successfully!');
      resetCode();
    } catch (err) {
      toast.error('Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    const completeCode = code.join('');
    if (completeCode.length === 6 && !hasSubmitted.current) {
      hasSubmitted.current = true;
      onComplete(completeCode);
    }
  }, [code, onComplete]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-gradient-to-br from-[#0079C1]/80 via-[#00AEEF]/60 to-[#7ED321]/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold" style={{ color: '#0079C1' }}>Verify your email</h3>
          {email && (
            <p className="mt-2 text-sm text-gray-100/90">
              Enter the verification code sent to <span className="font-semibold text-white/90">{email}</span>
            </p>
          )}
        </div>

        <div className="flex justify-center space-x-3 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={disabled}
              className={`w-12 h-14 text-center text-2xl font-semibold border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#0079C1]
                ${error ? 'border-red-500 shake-animation' : 'border-white/60'}
                ${disabled ? 'opacity-70 cursor-not-allowed bg-gray-100' : 'bg-white/80'}
                transition-all duration-200 shadow-sm backdrop-blur`}
            />
          ))}
        </div>

        {error && (
          <div className="text-center text-sm text-red-500 mb-4">
            {errorMessage || 'The verification code you entered is invalid. Please try again.'}
          </div>
        )}

        {onResend && (
          <div className="text-center mt-4">
            <button
              onClick={handleResendClick}
              disabled={isResending || disabled}
              className="text-sm font-medium text-[#00AEEF] hover:text-[#0079C1] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <span className="flex items-center justify-center">
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Resending...
                </span>
              ) : (
                "Didn't receive a code? Resend"
              )}
            </button>
          </div>
        )}
        {/* Footer inside card, right-aligned */}
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

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .shake-animation {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default VerificationCodeInput;
