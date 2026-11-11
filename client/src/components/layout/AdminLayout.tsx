import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  FileSpreadsheet,
  Users,
  Settings,
  ExternalLink,
  LogOut,
  Sliders,
  Shield,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { logout } from '@/features/auth/authSlice';

export const AdminLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
      isActive
        ? 'bg-industrial-orange text-white shadow-xs'
        : 'text-slate-400 hover:text-white hover:bg-navy-800'
    }`;

  return (
    <div className="min-h-screen bg-surface-offwhite flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-navy-950 text-white shrink-0 flex flex-col justify-between border-r border-navy-800">
        <div>
          {/* Logo & Platform Info */}
          <div className="p-6 border-b border-navy-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-industrial-orange rounded-md flex items-center justify-center font-extrabold text-navy-950 text-sm">
                WTS
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-white block">
                  Admin Platform
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                  Enterprise v1.0
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <NavLink to="/admin" end className={navClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </NavLink>

            <NavLink to="/admin/products" className={navClass}>
              <Package className="w-4 h-4" />
              <span>Product Inventory</span>
            </NavLink>

            <NavLink to="/admin/rfqs" className={navClass}>
              <FileSpreadsheet className="w-4 h-4" />
              <span>RFQ Management</span>
            </NavLink>

            <NavLink to="/admin/users" className={navClass}>
              <Users className="w-4 h-4" />
              <span>User Management</span>
            </NavLink>

            <NavLink to="/admin/settings" className={navClass}>
              <Settings className="w-4 h-4" />
              <span>Platform & Hero Settings</span>
            </NavLink>
          </nav>
        </div>

        {/* User Footer & Public Portal Shortcut */}
        <div className="p-4 border-t border-navy-800 space-y-3">
          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2 bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
          >
            <span>Visit Public Catalog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-between pt-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-navy-800 rounded-full flex items-center justify-center text-industrial-orange font-bold text-xs">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div className="truncate max-w-[120px]">
                <span className="font-semibold text-white truncate block">
                  {user?.fullName || 'Administrator'}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {user?.role || 'Admin'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

