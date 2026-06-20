import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  UserCog, 
  GraduationCap, 
  UserRound, 
  Link2, 
  UserPlus, 
  UserCheck, 
  ChevronRight,
  School,
  FolderGit,
  ClipboardCheck,
  User,
  LogOut 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

type UserRole = 'ADMIN' | 'MANAGER' | 'TEACHER';

interface SubMenuItem {
  path: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  roles: UserRole[];
  children?: SubMenuItem[];
}

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const currentRole = user?.role as UserRole | undefined;

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    return {
      users: ['/managers', '/teachers', '/students'].includes(location.pathname),
      assignments: ['/teaching-assignments', '/enrollments'].includes(location.pathname),
    };
  });

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = (): void => {
    clearAuth();
    navigate('/login');
  };

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Boshqaruv Paneli', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER', 'TEACHER'] },
    { id: 'finance', label: 'Moliya & Billing', path: '/finance', icon: Wallet, roles: ['ADMIN', 'MANAGER'] },
    {
      id: 'users',
      label: 'Foydalanuvchilar',
      icon: Users,
      roles: ['ADMIN', 'MANAGER'],
      children: [
        { path: '/managers', label: 'Menejerlar', icon: UserCog, roles: ['ADMIN'] },
        { path: '/teachers', label: 'Oʻqituvchilar', icon: UserRound, roles: ['ADMIN', 'MANAGER'] },
        { path: '/students', label: 'Oʻquvchilar', icon: GraduationCap, roles: ['ADMIN', 'MANAGER'] },
      ]
    },
    {
      id: 'assignments',
      label: 'Biriktirishlar',
      icon: Link2,
      roles: ['ADMIN', 'MANAGER'],
      children: [
        { path: '/teaching-assignments', label: 'Ustozni biriktirish', icon: UserCheck, roles: ['ADMIN', 'MANAGER'] },
        { path: '/enrollments', label: 'Oʻquvchini guruhga qoʻshish', icon: UserPlus, roles: ['ADMIN', 'MANAGER'] },
      ]
    },
    { id: 'groups', label: 'Guruhlar', path: '/groups', icon: FolderGit, roles: ['ADMIN', 'MANAGER'] },
    { id: 'rooms', label: 'Xonalar', path: '/rooms', icon: School, roles: ['ADMIN', 'MANAGER'] },
    {
      id: 'attendance',
      label: 'Davomat',
      path: '/attendance/my-group', // 🔥 FIX: Static ID o'rniga maxsus kalit so'z yozdik!
      icon: ClipboardCheck,
      roles: ['TEACHER'],
    },
    { 
      id: 'profile',
      label: 'Profil',
      path: '/profile',
      icon: User,
      roles: ['ADMIN', 'MANAGER', 'TEACHER']
    }
  ];

  return (
    <aside className="w-72 h-screen bg-[color-mix(in_srgb,var(--card)_45%,transparent)] backdrop-blur-xl border-r border-[color-mix(in_srgb,var(--border)_40%,transparent)] flex flex-col transition-all duration-300 sticky top-0 left-0 z-20">
      
      {/* BRANDING */}
      <div className="h-20 flex items-center px-6 mb-4">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-white font-black text-xl italic">Z</span>
        </div>
        <div className="ml-3 flex flex-col">
          <span className="text-text-main font-black tracking-tighter text-xl">ZARBDOR</span>
          <span className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase -mt-1">Management System</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-4">
        <div className="space-y-1.5">
          {menuItems.map((item) => {
            if (!currentRole || !item.roles.includes(currentRole)) return null;

            const isDropdown = !!item.children;
            const isOpen = openMenus[item.id];
            
            const isActive = item.path 
              ? item.id === 'attendance'
                ? location.pathname.startsWith('/attendance')
                : location.pathname === item.path 
              : false;

            return (
              <div key={item.id} className="flex flex-col">
                {isDropdown ? (
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.id)}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer
                      ${isOpen ? 'bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-primary font-bold' : 'text-text-muted hover:bg-[color-mix(in_srgb,var(--background)_50%,transparent)] hover:text-text-main'}`}
                  >
                    <div className="flex items-center">
                      <item.icon size={20} className={isOpen ? 'text-primary' : 'text-text-muted group-hover:text-text-main'} />
                      <span className="ml-3 text-sm font-semibold">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={item.path!}
                    className={`group flex items-center px-3 py-2.5 rounded-xl transition-all duration-200
                      ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/25 font-bold' : 'text-text-muted hover:bg-[color-mix(in_srgb,var(--background)_50%,transparent)] hover:text-text-main'}`}
                  >
                    <item.icon size={20} />
                    <span className="ml-3 text-sm font-semibold">{item.label}</span>
                  </Link>
                )}

                <AnimatePresence>
                  {isDropdown && isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden ml-6 mt-1 border-l-2 border-[color-mix(in_srgb,var(--border)_40%,transparent)]"
                    >
                      {item.children?.map((child) => {
                        if (!currentRole || !child.roles.includes(currentRole)) return null;
                        const isChildActive = location.pathname === child.path;

                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`flex items-center px-4 py-2 mt-1 mx-2 rounded-lg text-xs font-medium transition-all
                              ${isChildActive ? 'text-primary bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] font-bold' : 'text-text-muted hover:text-text-main hover:bg-[color-mix(in_srgb,var(--background)_40%,transparent)]'}`}
                          >
                            <child.icon size={14} className="mr-2" />
                            {child.label}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </nav>

      {/* UNIVERSAL PROFILE CARD */}
      <div className="border-t border-[color-mix(in_srgb,var(--border)_30%,transparent)] p-4 flex items-center justify-between bg-[color-mix(in_srgb,var(--background)_15%,transparent)] backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] border border-[color-mix(in_srgb,var(--primary)_25%,transparent)] flex items-center justify-center text-primary font-bold text-sm shrink-0 shadow-inner select-none">
            {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-text-main leading-tight truncate">
              {user ? `${user.firstName} ${user.lastName}` : 'Foydalanuvchi'}
            </span>
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider mt-0.5 truncate">
              {user?.role || 'MEHMON'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center p-2.5 text-text-muted bg-red-500/60 border border-transparent rounded-xl hover:bg-red-700 hover:text-white hover:shadow-md hover:shadow-red-500/10 transition-all duration-200 cursor-pointer group shrink-0"
          title="Tizimdan chiqish"
        >
          <LogOut size={16} className="group-hover:scale-105 transition-transform" />
        </button>
      </div>

    </aside>
  );
};