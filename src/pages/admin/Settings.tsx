
"use client";
import React, { useState, useEffect } from 'react';
import { Settings, User, Shield, Bell, CreditCard, Lock, ChevronDown, Loader2, Check } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';

interface SettingsData {
  siteName: string;
  adminEmail: string;
  timezone: string;
  dateFormat: string;
  maintenanceMode: boolean;
  enableRegistration: boolean;
}

const DEFAULT_SETTINGS: SettingsData = {
  siteName: 'My Site',
  adminEmail: 'admin@example.com',
  timezone: 'UTC',
  dateFormat: 'YYYY-MM-DD',
  maintenanceMode: false,
  enableRegistration: true,
};

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService().sendPostToServer('admin/settings', {}) as { settings?: Partial<SettingsData> };
        
        // If response is successful but empty, use defaults
        if (!response) {
          console.warn('Empty response received, using default settings');
          setFormData(DEFAULT_SETTINGS);
          return;
        }

        // Merge received settings with defaults
        setFormData({
          ...DEFAULT_SETTINGS,
          ...(response.settings || {}),
        });
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Failed to load settings. Using default configuration.');
        setFormData(DEFAULT_SETTINGS);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      
      // Only send required fields (siteName) for backend
      const { siteName } = formData;
      const response = await apiService().sendPostToServer('admin/settings/update', { siteName }) as { message?: string };
      toast.success(response?.message || 'Settings saved successfully');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setError(error?.message || 'Failed to save settings. Please try again.');
      toast.error(error?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'users', name: 'User Settings', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'privacy', name: 'Privacy', icon: Lock },
  ];

  return (
  <div className="min-h-screen w-full">
      <div className="w-full h-full backdrop-blur-lg bg-white/20 rounded-none shadow-xl overflow-hidden border border-white/30 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0079C1]">System Settings</h1>
              <p className="text-sm text-[#0079C1]/80 mt-1">
                Configure system-wide settings and preferences
              </p>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="bg-white/80 rounded-lg shadow overflow-hidden border border-white/30">
            {/* Tabs */}
            <div className="border-b border-white/30">
              <nav className="flex -mb-px overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-[#00AEEF] text-[#0079C1]'
                        : 'border-transparent text-[#0079C1]/80 hover:text-[#0079C1] hover:border-[#00AEEF]/40'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[#0079C1]" />
                </div>
              ) : (
                <>
                  {activeTab === 'general' && (
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-lg font-medium text-[#0079C1] mb-4">General Settings</h2>
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                              <label htmlFor="siteName" className="block text-sm font-medium text-[#0079C1] mb-1">
                                Site Name
                              </label>
                              <input
                                type="text"
                                name="siteName"
                                id="siteName"
                                value={formData.siteName}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border border-white/30 shadow-sm focus:border-[#00AEEF] focus:ring-[#00AEEF] p-2 bg-white/60"
                              />
                            </div>
                            <div>
                              <label htmlFor="adminEmail" className="block text-sm font-medium text-[#0079C1] mb-1">
                                Admin Email
                              </label>
                              <input
                                type="email"
                                name="adminEmail"
                                id="adminEmail"
                                value={formData.adminEmail}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border border-white/30 shadow-sm focus:border-[#00AEEF] focus:ring-[#00AEEF] p-2 bg-white/60"
                              />
                            </div>
                            <div>
                              <label htmlFor="timezone" className="block text-sm font-medium text-[#0079C1] mb-1">
                                Timezone
                              </label>
                              <div className="relative">
                                <select
                                  id="timezone"
                                  name="timezone"
                                  value={formData.timezone}
                                  onChange={handleInputChange}
                                  className="appearance-none block w-full rounded-md border border-white/30 shadow-sm focus:border-[#00AEEF] focus:ring-[#00AEEF] p-2 pr-10 bg-white/60"
                                >
                                  <option value="UTC">UTC</option>
                                  <option value="EST">Eastern Standard Time (EST)</option>
                                  <option value="PST">Pacific Standard Time (PST)</option>
                                  <option value="CET">Central European Time (CET)</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <ChevronDown className="h-4 w-4 text-[#0079C1]/60" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="dateFormat" className="block text-sm font-medium text-[#0079C1] mb-1">
                                Date Format
                              </label>
                              <div className="relative">
                                <select
                                  id="dateFormat"
                                  name="dateFormat"
                                  value={formData.dateFormat}
                                  onChange={handleInputChange}
                                  className="appearance-none block w-full rounded-md border border-white/30 shadow-sm focus:border-[#00AEEF] focus:ring-[#00AEEF] p-2 pr-10 bg-white/60"
                                >
                                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <ChevronDown className="h-4 w-4 text-[#0079C1]/60" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/30">
                          <h2 className="text-lg font-medium text-[#0079C1] mb-4">System Options</h2>
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="maintenanceMode"
                                  name="maintenanceMode"
                                  type="checkbox"
                                  checked={formData.maintenanceMode}
                                  onChange={handleInputChange}
                                  className="h-4 w-4 rounded border-white/30 text-[#00AEEF] focus:ring-[#00AEEF] bg-white/60"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="maintenanceMode" className="font-medium text-[#0079C1]">
                                  Maintenance Mode
                                </label>
                                <p className="text-[#0079C1]/80">
                                  When enabled, only administrators can access the site.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="enableRegistration"
                                  name="enableRegistration"
                                  type="checkbox"
                                  checked={formData.enableRegistration}
                                  onChange={handleInputChange}
                                  className="h-4 w-4 rounded border-white/30 text-[#00AEEF] focus:ring-[#00AEEF] bg-white/60"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="enableRegistration" className="font-medium text-[#0079C1]">
                                  Enable User Registration
                                </label>
                                <p className="text-[#0079C1]/80">
                                  Allow new users to register accounts on the site.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-white/30">
                          <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00AEEF] hover:bg-[#0079C1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00AEEF] disabled:opacity-50"
                          >
                            {saving ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {activeTab === 'users' && (
                    <div className="py-4">
                      <h2 className="text-lg font-medium text-[#0079C1] mb-4">User Settings</h2>
                      <p className="text-[#0079C1]/80">User management settings will go here.</p>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="py-4">
                      <h2 className="text-lg font-medium text-[#0079C1] mb-4">Security Settings</h2>
                      <p className="text-[#0079C1]/80">Security and authentication settings will go here.</p>
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div className="py-4">
                      <h2 className="text-lg font-medium text-[#0079C1] mb-4">Notification Settings</h2>
                      <p className="text-[#0079C1]/80">Notification preferences will go here.</p>
                    </div>
                  )}

                  {activeTab === 'payments' && (
                    <div className="py-4">
                      <h2 className="text-lg font-medium text-[#0079C1] mb-4">Payment Settings</h2>
                      <p className="text-[#0079C1]/80">Payment gateway configurations will go here.</p>
                    </div>
                  )}

                  {activeTab === 'privacy' && (
                    <div className="py-4">
                      <h2 className="text-lg font-medium text-[#0079C1] mb-4">Privacy Settings</h2>
                      <p className="text-[#0079C1]/80">Privacy policy and data handling settings will go here.</p>
                    </div>
                  )}
                </>
              )}
            </div>
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
};

export default AdminSettings;