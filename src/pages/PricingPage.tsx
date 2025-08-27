import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface PricingPageProps {
  disabled?: boolean;
  hideSubmitButton?: boolean;
}
const PRICING_PACKAGES = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'UGX 50,000',
    features: ['1 Branch', 'Basic Support', 'Listing on Platform'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 'UGX 150,000',
    features: ['Up to 5 Branches', 'Priority Support', 'Featured Listing'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'UGX 300,000',
    features: ['Unlimited Branches', '24/7 Support', 'Top Placement'],
  },
];

const PAYMENT_METHODS = [
  { id: 'mobile_money', label: 'Mobile Money' },
  { id: 'bank_transfer', label: 'Bank Transfer' },
];

const PricingPage: React.FC<PricingPageProps> = ({ disabled, hideSubmitButton }) => {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // You can access businessData, images, coverImageIndex from location.state if needed
  // const { businessData, images, coverImageIndex } = location.state || {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would handle the payment logic or API call
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Thank you!</h2>
          <p className="mb-2">Your package selection and payment details have been submitted.</p>
          <p className="text-gray-500">We will process your registration and notify you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-2">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-2">Choose a Pricing Package</h2>
        <p className="text-center text-gray-500 mb-8">Select the package that best fits your business needs</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {PRICING_PACKAGES.map(pkg => (
            <div
              key={pkg.id}
              className={`border rounded-xl p-6 shadow-sm cursor-pointer transition-all ${selectedPackage === pkg.id ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-blue-400'}`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-800">{pkg.name}</h3>
              <div className="text-2xl font-bold text-green-700 mb-2">{pkg.price}</div>
              <ul className="text-sm text-gray-600 mb-2 list-disc pl-5">
                {pkg.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              {selectedPackage === pkg.id && <div className="mt-2 text-green-600 font-semibold">Selected</div>}
            </div>
          ))}
        </div>
        {selectedPackage && (
          <form onSubmit={handleSubmit} className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Payment Method</h4>
            <div className="flex gap-6 mb-4">
              {PAYMENT_METHODS.map(method => (
                <label key={method.id} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="mr-2"
                    required
                  />
                  {method.label}
                </label>
              ))}
            </div>
            {paymentMethod && (
              <div className="mb-4">
                <label className="block mb-1 text-gray-700">
                  {paymentMethod === 'mobile_money' ? 'Mobile Money Number' : 'Bank Transaction Reference'}
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={paymentDetails}
                  onChange={e => setPaymentDetails(e.target.value)}
                  required
                  placeholder={paymentMethod === 'mobile_money' ? 'Enter Mobile Money Number' : 'Enter Bank Reference'}
                />
              </div>
            )}
            {!hideSubmitButton && (
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors mt-2"
                disabled={!paymentMethod || !paymentDetails}
              >
                Submit
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default PricingPage;
