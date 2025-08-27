import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Home, Users, FileText, CreditCard, Shield, Building, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';

const navLinks = [
  { name: 'Dashboard', link: '/admin/dashboard', icon: Home },
  { name: 'Users', link: '/admin/users', icon: Users },
  { name: 'Bookings', link: '/admin/bookings', icon: FileText },
  { name: 'Transactions', link: '/admin/transactions', icon: CreditCard },
  { name: 'Business Approvals', link: '/admin/approvals', icon: Shield },
  { name: 'Listing Approvals', link: '/admin/listing-approvals', icon: FileText },
  { name: 'Businesses', link: '/admin/businesses', icon: Building },
  { name: 'Master Data', link: '/admin/banks', icon: CreditCard },
  { name: 'Settings', link: '/admin/settings', icon: Settings },
];

import { ReactNode } from 'react';

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full" style={{
      backgroundImage: `url(${process.env.PUBLIC_URL + '/backgroundsimages/waterfall.jpg'})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      <div className="w-full h-full backdrop-blur-lg bg-white/20 rounded-none shadow-xl overflow-hidden border border-white/30 flex">
        {/* Fixed Sidebar */}
        <div className="hidden md:flex md:w-64 bg-gradient-to-b from-[#0079C1]/90 via-[#00AEEF]/90 to-[#7ED321]/90 p-4 flex-col justify-between fixed h-full">
          <div>
            <div className="flex flex-col items-center mb-6">
              <div className="bg-white rounded-full shadow-lg p-2 mb-2 flex items-center justify-center" style={{ width: '60px', height: '60px' }}>
                <img src={process.env.PUBLIC_URL + '/logo/egret other-04.png'} alt="Logo" className="h-10 w-10 object-contain" />
              </div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>
            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {navLinks.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.link}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
                            : 'text-white/80 hover:bg-white/10'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="ml-3 font-medium">{item.name}</span>
                    </NavLink>
                  </li>
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
        {/* Scrollable Main Content */}
        <div className="flex-1 p-8 backdrop-blur-sm bg-white/10 flex flex-col min-h-full ml-0 md:ml-64 overflow-y-auto">
          {children ? children : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
