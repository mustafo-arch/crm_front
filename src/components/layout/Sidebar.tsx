import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

type UserRole = 'ADMIN' | 'MANAGER' | 'TEACHER';

interface MenuItem {
  path: string;
  label: string;
  roles: UserRole[];
}

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore(); 
  const currentRole = user?.role as UserRole | undefined;

  const menuItems: MenuItem[] = [
    { path: '/dashboard', label: 'Dashboard', roles: ['ADMIN', 'MANAGER', 'TEACHER'] },
    { path: '/managers', label: 'Managerlar', roles: ['ADMIN'] },
    { path: '/teachers', label: 'Oʻqituvchilar', roles: ['ADMIN', 'MANAGER'] },
    { path: '/rooms', label: 'Xonalar', roles: ['ADMIN', 'MANAGER'] },
    { path: '/groups', label: 'Guruhlar', roles: ['ADMIN', 'MANAGER'] },
    { path: '/teaching-assignments', label: 'Ustozlar Biriktiruvi', roles: ['ADMIN', 'MANAGER'] },
    { path: '/students', label: 'Oʻquvchilar', roles: ['ADMIN', 'MANAGER'] },
    // Yangi qo'shilgan modul:
    { path: '/enrollments', label: 'O‘quvchilar Biriktiruvi', roles: ['ADMIN', 'MANAGER'] },
    { path: '/attendance', label: 'Davomat', roles: ['TEACHER'] },
    { path: '/finance', label: 'Moliya', roles: ['ADMIN', 'MANAGER'] },
    { path: '/profile', label: 'Profil', roles: ['ADMIN', 'MANAGER', 'TEACHER'] },
  ];

  return (
    <div className="fixed top-0 left-0 bottom-0 w-64 h-screen bg-card border-r border-border flex flex-col p-4 text-text-main z-50 overflow-y-auto">
      <div className="mb-8 px-2 shrink-0">
        <span className="text-lg font-black tracking-wider text-primary">ZARBDOR CRM</span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          // Rolni tekshirish
          if (!currentRole || !item.roles.includes(currentRole)) return null;

          // Aktivlikni tekshirish (path larni to'g'ri ishlashi uchun)
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-muted hover:bg-background hover:text-text-main'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};