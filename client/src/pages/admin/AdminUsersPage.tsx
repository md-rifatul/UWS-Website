import React, { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Check,
  X,
  Shield,
  ShieldAlert,
  Building,
  Phone,
  Mail,
  UserCheck,
  UserX,
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { User, UserRole } from '@/types';
import Button from '@/components/common/Button';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New User Form State
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    role: 'CorporateBuyer' as UserRole,
    password: '',
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.fullName) return;

    const created = await adminService.createUser(form);
    setUsers([created, ...users]);
    setIsModalOpen(false);
    setForm({
      fullName: '',
      email: '',
      phone: '',
      companyName: '',
      role: 'CorporateBuyer',
      password: '',
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggleStatus = async (user: User) => {
    const updated = await adminService.toggleUserStatus(user.id);
    setUsers(users.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u)));
  };

  const handleChangeRole = async (user: User, newRole: UserRole) => {
    await adminService.updateUserRole(user.id, newRole);
    setUsers(users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.companyName && u.companyName.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SalesManager':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-border pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-industrial-orange">
            Access Governance &amp; RBAC
          </span>
          <h1 className="text-2xl font-extrabold text-navy-900 mt-0.5">User Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage administrative platform access, Sales Manager assignments, and Corporate Buyer permissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> User Created!
            </span>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
            className="font-semibold shadow-xs"
          >
            Add Platform User
          </Button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by user name, corporate email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-border rounded-md text-charcoal-800 placeholder-slate-400 focus:outline-none focus:border-industrial-orange"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-xs px-3 py-2 bg-white border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
        >
          <option value="">All Roles</option>
          <option value="Admin">Administrator</option>
          <option value="SalesManager">Sales Manager</option>
          <option value="CorporateBuyer">Corporate Buyer</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-offwhite border-b border-slate-border text-slate-muted uppercase tracking-wider">
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Company &amp; Phone</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-border">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy-900 text-industrial-orange font-bold text-xs flex items-center justify-center shrink-0">
                        {u.fullName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-navy-900 block">{u.fullName}</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {u.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-medium text-charcoal-800 block">{u.companyName || '—'}</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {u.phone || '—'}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u, e.target.value as UserRole)}
                      className={`text-[11px] font-bold px-2 py-1 rounded border focus:outline-none ${getRoleBadge(
                        u.role
                      )}`}
                    >
                      <option value="Admin">Administrator</option>
                      <option value="SalesManager">Sales Manager</option>
                      <option value="CorporateBuyer">Corporate Buyer</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4">
                    {u.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        <X className="w-3 h-3" /> Suspended
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(u)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
                        u.isActive
                          ? 'border-red-200 text-red-600 hover:bg-red-50'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {u.isActive ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-border flex items-center justify-between bg-navy-950 text-white">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-industrial-orange" />
                <h3 className="font-bold text-sm">Add New Platform User</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engr. Tanvir Ahmed"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tanvir@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+880 1711-..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Partex Furniture Ltd."
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                    Platform Role *
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                    className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange font-semibold"
                  >
                    <option value="CorporateBuyer">Corporate Buyer</option>
                    <option value="SalesManager">Sales Manager</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                    Initial Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-border flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" className="font-semibold">
                  Create User Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;

