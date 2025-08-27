import { BankAccount } from '../../types/types';
import { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

interface BankStepProps {
  bankAccounts: BankAccount[];
  onChange: (accounts: BankAccount[]) => void;
  errors: { [key: string]: string };
  disabled?: boolean;
}


// Banks and branches will be fetched from the backend


// Account types will be fetched from the backend

const BankStep: React.FC<BankStepProps> = ({ bankAccounts, onChange, errors = {}, disabled }) => {
  // Ensure at least one account is present on mount
  useEffect(() => {
    if (!bankAccounts || bankAccounts.length === 0) {
      onChange([
        {
          id: '',
          bankId: '',
          bankName: '',
          accountNumber: '',
          accountName: '',
          branch: '',
          accountType: '',
          isPrimary: true,
        },
      ]);
    }
  }, []); // Only run on mount
  const [banks, setBanks] = useState<{ id: string; name: string; branches: string[] }[]>([]);
  const [, setAvailableBranches] = useState<{[key: string]: string[]}>({});
  const [accountTypes, setAccountTypes] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const api = apiService();
        const res = await api.sendPostToServer('businesses/banks', {});
        let arr: any[] = [];
        if (Array.isArray(res)) {
          arr = res;
        } else if (res && typeof res === 'object' && 'data' in res && Array.isArray((res as any).data)) {
          arr = (res as any).data;
        }
        // Ensure branches is always an array of strings
        arr = arr.map((bank: any) => {
          let branches = bank.branches;
          if (typeof branches === 'string') {
            try {
              let parsed = JSON.parse(branches);
              if (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
              }
              if (Array.isArray(parsed)) {
                branches = parsed;
              } else {
                branches = [branches];
              }
            } catch {
              branches = [branches];
            }
          }
          if (!Array.isArray(branches)) {
            branches = [branches];
          }
          branches = branches.map((b: any) => String(b));
          return { ...bank, id: String(bank.id), branches };
        });
        setBanks(arr);
        // Set available branches map
        const branchesMap: {[key: string]: string[]} = {};
        arr.forEach((bank: any) => {
          branchesMap[bank.id] = bank.branches;
        });
        setAvailableBranches(branchesMap);
      } catch (e) {
        setBanks([]);
        setAvailableBranches({});
      }
    };

    const fetchAccountTypes = async () => {
      try {
        const api = apiService();
        const res = await api.sendPostToServer('businesses/account-types', {});
        let arr: any[] = [];
        if (Array.isArray(res)) {
          arr = res;
        } else if (res && typeof res === 'object' && 'data' in res && Array.isArray((res as any).data)) {
          arr = (res as any).data;
        }
        arr = arr.map((type: any) => ({ value: type.name || type, label: type.name || type }));
        setAccountTypes(arr);
      } catch (e) {
        setAccountTypes([]);
      }
    };

    fetchBanks();
    fetchAccountTypes();
  }, []);

  // Add account number type for each account
  const [accountNumberTypes, setAccountNumberTypes] = useState<("IBAN"|"SWIFT/BIC"|"Local")[]>(
    bankAccounts.map(() => "Local")
  );

  // Update type when accounts change (add/remove)
  useEffect(() => {
    setAccountNumberTypes((prev) => {
      if (bankAccounts.length > prev.length) {
        return [...prev, "Local"];
      } else if (bankAccounts.length < prev.length) {
        return prev.slice(0, bankAccounts.length);
      }
      return prev;
    });
  }, [bankAccounts.length]);

  const handleAccountChange = (idx: number, field: keyof BankAccount, value: string | boolean) => {
    const updated = [...bankAccounts];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange(updated);
  };

  const removeAccount = (idx: number) => {
    const updated = bankAccounts.filter((_, i) => i !== idx);
    onChange(updated);
  };

  const addAccount = () => {
    onChange([
      ...bankAccounts,
      {
        id: '',
        bankId: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
        branch: '',
        accountType: '',
        isPrimary: bankAccounts.length === 0, // Set as primary if first account
      },
    ]);
  };


  const handleBankChange = (idx: number, bankId: string) => {
    const selectedBank = banks.find(bank => bank.id === bankId);
    const updated = [...bankAccounts];
    updated[idx] = {
      ...updated[idx],
      bankId,
      bankName: selectedBank?.name || '',
      branch: '' // Reset branch when bank changes
    };
    onChange(updated);
  };

  const handlePrimaryChange = (idx: number, isPrimary: boolean) => {
    const updated = bankAccounts.map((account, i) => ({
      ...account,
      isPrimary: i === idx ? isPrimary : false
    }));
    onChange(updated);
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Bank Information</h2>
      <div className="space-y-6">
        {bankAccounts.map((account, idx) => (
          <div key={idx} className="border-b pb-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Bank #{idx + 1}</h3>
              {bankAccounts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAccount(idx)}
                  disabled={disabled}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove Bank
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Bank Name *</label>
                <select
                  value={account.bankId}
                  onChange={(e) => handleBankChange(idx, e.target.value)}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${(errors[`bankAccounts.${idx}.bankId`] || (!account.bankId && Object.keys(errors).length > 0)) ? 'border-red-500' : 'border-gray-300'}`}
                  data-error={`bankAccounts.${idx}.bankId`}
                  required
                  disabled={disabled}
                >
                  <option value="">Select Bank</option>
                  {banks.map(bank => (
                    <option key={bank.id} value={bank.id}>{bank.name}</option>
                  ))}
                </select>
                {/* Strict: Only show error for required or filled optional fields */}
                {(errors[`bankAccounts.${idx}.bankId`] && account.bankId) && (
                  <p className="text-red-500 text-sm mt-1">{errors[`bankAccounts.${idx}.bankId`]}</p>
                )}
                {(!account.bankId && Object.keys(errors).length > 0) && (
                  <p className="text-red-500 text-sm mt-1">Bank name is required</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Account Name *</label>
                <input
                  value={account.accountName}
                  onChange={e => {
                    // Allow only letters, spaces, and basic punctuation
                    const value = e.target.value.replace(/[^a-zA-Z\s.'-]/g, '');
                    handleAccountChange(idx, 'accountName', value);
                  }}
                  placeholder="Enter Account Name"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${(errors[`bankAccounts.${idx}.accountName`] || (!account.accountName && Object.keys(errors).length > 0)) ? 'border-red-500' : 'border-gray-300'}`}
                  data-error={`bankAccounts.${idx}.accountName`}
                  required
                  disabled={disabled}
                />
                {(errors[`bankAccounts.${idx}.accountName`] && account.accountName) && (
                  <p className="text-red-500 text-sm mt-1">{errors[`bankAccounts.${idx}.accountName`]}</p>
                )}
                {(!account.accountName && Object.keys(errors).length > 0) && (
                  <p className="text-red-500 text-sm mt-1">Account name is required</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Bank Branch *</label>
                <input
                  type="text"
                  value={account.branch}
                  onChange={e => {
                    // Allow only letters, spaces, and basic punctuation (no numbers)
                    const value = e.target.value.replace(/[^a-zA-Z\s.'-]/g, '');
                    handleAccountChange(idx, 'branch', value);
                  }}
                  placeholder="Enter Bank Branch"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${(errors[`bankAccounts.${idx}.branch`] || (!account.branch && Object.keys(errors).length > 0)) ? 'border-red-500' : 'border-gray-300'}`}
                  data-error={`bankAccounts.${idx}.branch`}
                  required
                  disabled={disabled}
                />
                {(errors[`bankAccounts.${idx}.branch`] && account.branch) && (
                  <p className="text-red-500 text-sm mt-1">{errors[`bankAccounts.${idx}.branch`]}</p>
                )}
                {(!account.branch && Object.keys(errors).length > 0) && (
                  <p className="text-red-500 text-sm mt-1">Bank branch is required</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Account Number *</label>
                <select
                  value={accountNumberTypes[idx]}
                  onChange={e => {
                    const type = e.target.value as "IBAN"|"SWIFT/BIC"|"Local";
                    setAccountNumberTypes(types => types.map((t, i) => i === idx ? type : t));
                    handleAccountChange(idx, 'accountNumber', ''); // Clear on type change
                  }}
                  className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={disabled}
                >
                  <option value="Local">Local Account</option>
                  <option value="IBAN">IBAN</option>
                  <option value="SWIFT/BIC">SWIFT/BIC</option>
                </select>
                <input
                  type="text"
                  value={account.accountNumber}
                  onChange={e => {
                    let value = e.target.value;
                    switch (accountNumberTypes[idx]) {
                      case "IBAN":
                        value = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        break;
                      case "SWIFT/BIC":
                        value = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        break;
                      default:
                        value = value.replace(/\D/g, '');
                    }
                    handleAccountChange(idx, 'accountNumber', value);
                  }}
                  placeholder={(() => {
                    switch (accountNumberTypes[idx]) {
                      case "IBAN": return 'e.g., UG12BANK12345678901234';
                      case "SWIFT/BIC": return 'e.g., ABCLUGKA or ABCLUGKA123';
                      default: return 'e.g., 123456789012';
                    }
                  })()}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${(errors[`bankAccounts.${idx}.accountNumber`] || (!account.accountNumber && Object.keys(errors).length > 0)) ? 'border-red-500' : 'border-gray-300'}`}
                  data-error={`bankAccounts.${idx}.accountNumber`}
                  required
                  disabled={disabled}
                  maxLength={accountNumberTypes[idx] === 'IBAN' ? 34 : accountNumberTypes[idx] === 'SWIFT/BIC' ? 11 : 18}
                  inputMode={accountNumberTypes[idx] === 'IBAN' || accountNumberTypes[idx] === 'SWIFT/BIC' ? 'text' : 'numeric'}
                  pattern={(() => {
                    switch (accountNumberTypes[idx]) {
                      case "IBAN": return "[A-Z0-9]{2,34}";
                      case "SWIFT/BIC": return "[A-Z0-9]{8,11}";
                      default: return "\\d{8,18}";
                    }
                  })()}
                />
                {(errors[`bankAccounts.${idx}.accountNumber`] && account.accountNumber) && (
                  <p className="text-red-500 text-sm mt-1">{errors[`bankAccounts.${idx}.accountNumber`]}</p>
                )}
                {(!account.accountNumber && Object.keys(errors).length > 0) && (
                  <p className="text-red-500 text-sm mt-1">Account number is required</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Account Type *</label>
                <select
                  value={account.accountType}
                  onChange={e => handleAccountChange(idx, 'accountType', e.target.value)}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${(errors[`bankAccounts.${idx}.accountType`] || (!account.accountType && Object.keys(errors).length > 0)) ? 'border-red-500' : 'border-gray-300'}`}
                  data-error={`bankAccounts.${idx}.accountType`}
                  required
                  disabled={disabled}
                >
                  <option value="">Select Account Type</option>
                  {accountTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {(errors[`bankAccounts.${idx}.accountType`] && account.accountType) && (
                  <p className="text-red-500 text-sm mt-1">{errors[`bankAccounts.${idx}.accountType`]}</p>
                )}
                {(!account.accountType && Object.keys(errors).length > 0) && (
                  <p className="text-red-500 text-sm mt-1">Account type is required</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`primary-${idx}`}
                  checked={account.isPrimary}
                  onChange={e => handlePrimaryChange(idx, e.target.checked)}
                  data-error={idx === 0 ? 'primaryBank' : undefined}
                  disabled={disabled}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor={`primary-${idx}`} className="ml-2 block text-gray-700">
                  Primary Bank Account
                </label>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addAccount}
          disabled={disabled}
          className="ml-auto flex items-center px-6 py-2 rounded-lg text-white bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 disabled:opacity-70 transition-colors"
        >
          Add Bank Account
        </button>
      </div>
    </section>
  );
};

export default BankStep;