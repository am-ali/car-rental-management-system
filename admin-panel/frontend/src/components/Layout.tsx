import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Users, BarChart2, LogOut, Building2, Tag } from 'lucide-react';
import { useAuthStore } from '../stores/auth';

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart2 },
  { name: 'Cars', href: '/cars', icon: Car },
  { name: 'Categories', href: '/categories', icon: Tag },
  { name: 'Staff', href: '/staff', icon: Users },
  { name: 'Branches', href: '/branches', icon: Building2 },
  { name: 'Reports', href: '/reports', icon: BarChart2 },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="flex items-center justify-center h-16 border-b">
            <Car className="w-8 h-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold">Kiraye Di Gaddi</span>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 ${
                    location.pathname === item.href ? 'bg-gray-100' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}