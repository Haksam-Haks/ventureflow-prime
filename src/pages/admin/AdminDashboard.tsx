import React, { useState, useEffect, } from 'react';
import { useUser } from '../../contexts/UserContext';
import { Link, NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  BarChart2, Users, Building, CreditCard, Settings, Home, FileText, Shield,
  LogOut, Loader2,
} from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from "react-hot-toast";

interface Business {
  legal_name: string;
  trading_name: string;
  ownership_type: string;
  display_name: string;
  id: string;
  name: string;
  contact_email: string;
  contact_phone: string;
  description: string;
  status?: string;
  created_at: string;
  last_updated_at?: string;
  business_type?: string;
  owner_name?: string;
  owner_email?: string;
}

interface StatItem {
  name: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  change: string;
  changeType: 'positive' | 'negative';
}

interface ActionItem {
  id: number;
  type: string;
  count: number;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface QuickAction {
  name: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
}


const AdminDashboard: React.FC = () => {
  const [pendingBusinessCount, setPendingBusinessCount] = useState(0);
  const [recentBusinesses, setRecentBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [user, setUser] = useState<{ username?: string }>({});
  const [businessTypes, setBusinessTypes] = useState<Record<string, string>>({});
  const [, setApprovedBusinessCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardPage = location.pathname.endsWith('admin/dashboard') || location.pathname.endsWith('admin');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }

    fetchBusinessTypes();
    fetchDashboardData();
    // eslint-disable-next-line
  }, []);

  // Fetch business types from backend
  const fetchBusinessTypes = async () => {
    try {
      const res = await apiService().sendPostToServer<any>('admin/businessTypes', {});
      // Expecting: [{ id: 1, name: 'Hotel' }, ...]
      if (res?.success && Array.isArray(res?.returnObject || res?.data)) {
        const map: Record<string, string> = {};
        (res.returnObject || res.data).forEach((type: any) => {
          map[type.id?.toString()] = type.name;
        });
        setBusinessTypes(map);
      }
    } catch (err) {
      setBusinessTypes({});
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    let statsSet = false;
    let pendingSet = false;
    try {
      // Dashboard stats
      let dashboardRes;
      let allBusinessesRes;
      let approvedCount = 0;
      try {
        dashboardRes = await apiService().sendPostToServer<any>('admin/dashboard', {});
        const dashboardData = dashboardRes?.returnObject || dashboardRes?.data || {};
        // Fetch all businesses to count only approved
        allBusinessesRes = await apiService().sendPostToServer<any>('admin/businesses', {});
        if (allBusinessesRes?.success && Array.isArray(allBusinessesRes?.returnObject || allBusinessesRes?.data)) {
          const allBusinesses = (allBusinessesRes.returnObject || allBusinessesRes.data);
          approvedCount = allBusinesses.filter((b: any) => b.status === 'approved').length;
        }
        setApprovedBusinessCount(approvedCount);
        const mappedData = {
          totalbookings: Number(dashboardData.totalBookings || 0),
          bookingschange: 0,
          totalusers: Number(dashboardData.totalUsers || 0),
          userschange: 0,
          totalbusinesses: approvedCount, // Only approved
          businesseschange: 0,
          totalrevenue: Number(dashboardData.totalRevenue || 0),
          revenuechange: 0
        };
        const formattedStats: StatItem[] = [
          {
            name: 'Total Bookings',
            value: mappedData.totalbookings.toLocaleString(),
            icon: BarChart2,
            change: '0%',
            changeType: 'positive'
          },
          {
            name: 'Registered Users',
            value: mappedData.totalusers.toLocaleString(),
            icon: Users,
            change: '0%',
            changeType: 'positive'
          },
          {
            name: 'Business Partners',
            value: mappedData.totalbusinesses.toLocaleString(),
            icon: Building,
            change: '0%',
            changeType: 'positive'
          },
          {
            name: 'Total Revenue',
            value: `${mappedData.totalrevenue.toLocaleString()}`,
            icon: CreditCard,
            change: '0%',
            changeType: 'positive'
          }
        ];
        setStats(formattedStats);
        statsSet = true;
      } catch (err) {
        setStats([
          { name: 'Total Bookings', value: '0', icon: BarChart2, change: '0%', changeType: 'positive' },
          { name: 'Registered Users', value: '0', icon: Users, change: '0%', changeType: 'positive' },
          { name: 'Business Partners', value: '0', icon: Building, change: '0%', changeType: 'positive' },
          { name: 'Total Revenue', value: '$0', icon: CreditCard, change: '0%', changeType: 'positive' }
        ]);
      }

      // Pending count
      let pendingRes;
      try {
        pendingRes = await apiService().sendPostToServer<any>('admin/pending', {});
        let pendingCount = 0;
        if (typeof pendingRes?.returnObject === 'number') {
          pendingCount = pendingRes.returnObject;
        } else if (typeof pendingRes?.data === 'number') {
          pendingCount = pendingRes.data;
        }
        setPendingBusinessCount(Number(pendingCount));
        pendingSet = true;
      } catch (err) {
        setPendingBusinessCount(0);
      }

      // Recent businesses (optional)
      try {
        const recentRes = await apiService().sendPostToServer<any>('admin/businesses', {});
        let recentBusinessesList: Business[] = [];
        if (recentRes?.success && Array.isArray(recentRes?.returnObject || recentRes?.data)) {
          recentBusinessesList = (recentRes.returnObject || recentRes.data)
            .filter((b: any) => b.status === 'approved')
            .map((b: any) => ({
              id: b.id,
              business_type: b.business_type,
              legal_name: b.legal_name,
              trading_name: b.trading_name,
              ownership_type: b.ownership_type,
              display_name: b.display_name,
              status: b.status,
              created_at: b.created_at || b.createdAt
            }));
        }
        setRecentBusinesses(recentBusinessesList);
      } catch (err) {
        setRecentBusinesses([]);
      }

      if (!statsSet && !pendingSet) {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
  };

  const { logout } = useUser();
  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate('/login');
  };

  // Grouped sidebar categories and links
  const sidebarCategories = [
    {
      name: 'Dashboard',
      icon: Home,
      links: [
        { name: 'Dashboard', link: '/admin/dashboard', icon: Home },
      ],
    },
    {
      name: 'User & Bookings',
      icon: Users,
      links: [
        { name: 'Users', link: '/admin/users', icon: Users },
        { name: 'Bookings', link: '/admin/bookings', icon: FileText },
      ],
    },
    {
      name: 'Business Management',
      icon: Building,
      links: [
        { name: 'Approvals', link: '/admin/approvals', icon: Shield },
        { name: 'Approved Businesses', link: '/admin/approved-businesses', icon: Building },
      ],
    },
    {
      name: 'Finance',
      icon: CreditCard,
      links: [
        { name: 'Transactions', link: '/admin/transactions', icon: CreditCard },
        { name: 'Master Data', link: '/admin/banks', icon: CreditCard },
      ],
    },
    {
      name: 'Settings',
      icon: Settings,
      links: [
        { name: 'Settings', link: '/admin/settings', icon: Settings },
      ],
    },
  ];
  // Dropdown open state for each category
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const handleDropdownToggle = (category: string) => {
    setOpenDropdown(openDropdown === category ? null : category);
  };
  // Show both Business Approvals and Listing Approvals in Pending Actions
  const pendingActions: ActionItem[] = [
    {
      id: 1,
      type: 'Business Approvals',
      count: pendingBusinessCount,
      link: '/admin/approvals',
      icon: Shield
    },
    {
      id: 2,
      type: 'Listing Approvals',
      count: 0, // TODO: Replace with actual pending listings count if available
      link: '/admin/listing-approvals',
      icon: FileText
    }
  ];
  const quickActions: QuickAction[] = [
    { name: 'Manage Users', link: '/admin/users', icon: Users },
    { name: 'Business Approvals', link: '/admin/approvals', icon: Shield },
    { name: 'Transactions', link: '/admin/transactions', icon: CreditCard },
    { name: 'System Settings', link: '/admin/settings', icon: Settings },
  ];

  // DEBUG: Log data to help diagnose why nothing is showing
  useEffect(() => {
    console.log('recentBusinesses:', recentBusinesses);
    console.log('stats:', stats);
    console.log('pendingBusinessCount:', pendingBusinessCount);
    console.log('businessTypes:', businessTypes);
    console.log('loading:', loading);
  }, [recentBusinesses, stats, pendingBusinessCount, businessTypes, loading]);

  return (
      <div className="flex w-full h-screen">
        {/* Fixed Sidebar Navigation with Dropdowns */}
        <div className="hidden md:flex md:w-64 h-screen fixed top-0 left-0 z-30 bg-gradient-to-b from-[#0079C1]/90 via-[#00AEEF]/90 to-[#7ED321]/90 p-4 flex-col justify-between">
          <div>
            <div className="flex flex-col items-center mb-6">
              <div className="bg-white rounded-full shadow-lg p-2 mb-2 flex items-center justify-center" style={{ width: '60px', height: '60px' }}>
                <img
                  src={"/logo/egret other-04.png"}
                  alt="Egret Hospitality logo featuring a stylized egret bird in blue and green tones, set against a white circular background. The logo conveys professionalism and calm. No visible text in the image. The logo is displayed in a bright, welcoming sidebar environment."
                  className="h-10 w-10 object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>
            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {sidebarCategories.map((category) => (
                  category.name === 'Dashboard' ? (
                    <li key={category.name}>
                      <NavLink
                        to={category.links[0].link}
                        className={({ isActive }) =>
                          `flex items-center w-full px-4 py-3 rounded-lg transition-colors font-semibold text-lg drop-shadow-sm focus:outline-none border border-[rgba(255,255,255,0.15)] ${
                            isActive
                              ? 'bg-[#34D399] text-white shadow-md'
                              : 'text-[rgba(255,255,255,0.7)] hover:bg-white/10 hover:text-white'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <category.icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-[rgba(255,255,255,0.7)]'}`} />
                            <span className="ml-4 font-bold tracking-wide" style={{letterSpacing: '0.02em'}}>{category.name}</span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  ) : (
                    <li key={category.name}>
                      <button
                        type="button"
                        className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors font-semibold text-lg drop-shadow-sm focus:outline-none border border-[rgba(255,255,255,0.15)] ${openDropdown === category.name ? 'bg-white/20 text-white' : 'text-[rgba(255,255,255,0.7)] hover:bg-white/10 hover:text-white'}`}
                        onClick={() => handleDropdownToggle(category.name)}
                      >
                        <category.icon className={`h-6 w-6 ${openDropdown === category.name ? 'text-[#22D3EE]' : 'text-[rgba(255,255,255,0.7)]'}`} />
                        <span className="ml-4 font-bold tracking-wide" style={{letterSpacing: '0.02em'}}>{category.name}</span>
                        <span className="ml-auto">
                          <svg className={`h-5 w-5 transition-transform ${openDropdown === category.name ? 'rotate-180 text-[#22D3EE]' : 'text-[rgba(255,255,255,0.7)]'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                      </button>
                      {/* Dropdown links */}
                      {openDropdown === category.name && (
                        <ul className="pl-8 py-2 space-y-3">
                          {category.links.map((item) => (
                            <li key={item.name}>
                              <NavLink
                                to={item.link}
                                className={({ isActive }) =>
                                  `flex items-center px-4 py-3 rounded-xl border transition-colors font-extrabold text-lg drop-shadow-sm border border-[rgba(255,255,255,0.15)] ${
                                    isActive
                                      ? 'bg-[#22D3EE] text-white shadow-md border-[#22D3EE]'
                                      : 'text-[rgba(255,255,255,0.7)] hover:bg-white/10 hover:text-white border-transparent'
                                  }`
                                }
                              >
                                {({ isActive }) => (
                                  <>
                                    <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-[rgba(255,255,255,0.7)]'}`} />
                                    <span className="ml-3 font-extrabold tracking-wide" style={{letterSpacing: '0.01em'}}>{item.name}</span>
                                  </>
                                )}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
                ))}
              </ul>
            </nav>
          </div>
          <div className="mt-8">
            <button
              className="flex items-center w-full px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 md:ml-64 h-screen overflow-y-auto p-8 backdrop-blur-sm bg-white/10 flex flex-col min-h-full">
          <main className="w-full">
            <Outlet />
            {!isDashboardPage ? null : loading ? (
              <div className="text-center py-20 text-[#0079C1]">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#0079C1]" />
                <p className="mt-4">Loading dashboard data...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-[#0079C1]">
                      Welcome, {user?.username ? user.username.split(' ').slice(-1)[0] : 'Admin'} 👋
                    </h1>
                    <p className="text-sm text-[#0079C1]/80">Dashboard Overview</p>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat) => (
                    <div key={stat.name} className="bg-white/80 p-6 rounded-lg shadow border border-white/60">
                      <div className="flex items-center">
                        <div className={`p-3 rounded-lg ${
                          stat.changeType === 'positive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-[#0079C1]/80">{stat.name}</p>
                          <p className="text-2xl font-semibold text-[#0079C1]">{stat.value}</p>
                        </div>
                      </div>
                      <div className={`mt-4 text-sm ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change} from last month
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pending Actions */}
                <div className="bg-white/80 p-6 rounded-lg shadow border border-white/60">
                  <h2 className="text-lg font-semibold text-[#0079C1] mb-4">Pending Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pendingActions.map((action) => (
                      <Link
                        key={action.id}
                        to={action.link}
                        className="p-4 border border-white/30 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="p-3 rounded-lg bg-[#00AEEF]/20 text-[#00AEEF]">
                            <action.icon className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-sm font-medium text-[#0079C1]">{action.type}</h3>
                            <p className="text-sm text-[#0079C1]/80">{action.count} pending</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recent Businesses - Custom columns as requested */}
                <div className="bg-white/80 rounded-lg shadow overflow-hidden border border-white/60">
                  <div className="p-4 border-b border-white/30 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-[#0079C1]">Recent Business Registrations</h2>
                  </div>
                  <div className="w-full overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/30">
                      <thead className="bg-white/10">
                        <tr>
                          {['ID','Business Type','Legal Name','Trading Name','Ownership Type','Display Name','Status','Created At'].map(
                            (col) => (
                              <th
                                key={col}
                                scope="col"
                                className="px-2 py-3 text-left text-xs font-medium text-[#0079C1]/80 uppercase tracking-wider truncate"
                                style={{maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                {col}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white/10 divide-y divide-white/30">
                        {Array.isArray(recentBusinesses) && recentBusinesses.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-6 py-4 text-center text-[#0079C1]/80">
                              No recent business registrations
                            </td>
                          </tr>
                        ) : (
                          Array.isArray(recentBusinesses) && recentBusinesses.map((business) => (
                            <tr key={business.id} className="hover:bg-white/20">
                              <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.id}</td>
                              <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.business_type || '-'}</td>
                              <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.legal_name || '-'}</td>
                              <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.trading_name || '-'}</td>
                              <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.ownership_type || '-'}</td>
                              <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.display_name || '-'}</td>
                              <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.status || '-'}</td>
                              <td className="px-2 py-4 truncate" style={{maxWidth: 140}}>{business.created_at ? formatDate(business.created_at) : '-'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/80 p-6 rounded-lg shadow border border-white/60">
                  <h2 className="text-lg font-semibold text-[#0079C1] mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                      <Link
                        key={action.name}
                        to={action.link}
                        className="flex flex-col items-center p-4 hover:bg-white/20 rounded-lg transition-colors border border-white/30"
                      >
                        <div className="p-3 rounded-lg bg-[#00AEEF]/20 text-[#00AEEF] mb-2">
                          <action.icon className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-[#0079C1] text-center">{action.name}</span>
                      </Link>
                    ))}
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
            )}
          </main>
        </div>
      </div>
  );
};

export default AdminDashboard;