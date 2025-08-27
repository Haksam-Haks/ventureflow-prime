import React from 'react';

interface ThankYouStepProps {
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  businessType: string;
  registrationAuthority: string;
  physicalAddress: string;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
  primaryBankAccount: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    branch: string;
    accountType: string;
  };
  registrationStatus?: string;
  imageUrl?: string; // base64 or url
}


const ThankYouStep: React.FC<ThankYouStepProps> = ({ businessName = '', contactEmail = '', imageUrl = '' }) => (
<div className="min-h-screen flex items-center justify-center bg-gray- p-4">
  <div className="w-full max-w-4xl h-auto bg-white rounded-2xl shadow-xl overflow-hidden">

    {/* Header */}
    <div className="bg-gradient-to-r from-[#00AEEF] to-[#0079C1] p-8 text-white text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Thank You!</h1>
      <p className="text-lg md:text-xl">
        Your registration for <span className="font-semibold">{businessName}</span> has been submitted.
      </p>
    </div>

    {/* Image */}
    {imageUrl && (
      <div className="flex justify-center mt-6">
        <img
          src={imageUrl}
          alt="Business Logo"
          className="h-40 w-40 md:h-48 md:w-48 object-cover rounded-xl border-4 border-white shadow-xl"
          style={{ aspectRatio: '1 / 1' }}
        />
      </div>
    )}

    {/* Content */}
    <div className="p-8 text-center space-y-4">
      <p className="text-gray-700 text-base md:text-lg">
        We have received your application and will review it soon.
      </p>
      <p className="text-gray-700 text-base md:text-lg">
        A confirmation will be sent to <span className="font-semibold">{contactEmail}</span> once approved.
      </p>
      <p className="text-gray-500 text-sm md:text-base">
        Need help? Email <span className="font-semibold">support@egret.com</span>
      </p>
    </div>

    {/* Footer */}
    <div className="border-t border-gray-200 mt-8 bg-gradient-to-r from-[#00AEEF] to-[#0079C1] p-4 text-center">
      <p className="text-xs md:text-sm text-white">
        © 2025 Egret Systems | Powered by Nepserv Consults Limited
      </p>
    </div>

  </div>
</div>


);
export default ThankYouStep;