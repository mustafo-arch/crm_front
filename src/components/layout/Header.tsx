// src/components/layout/Header.tsx
import { useLocation } from 'react-router-dom';
import { Sun, Moon, Calendar } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Boshqaruv Paneli',
  '/finance': 'Moliya & Billing',
  '/managers': 'Menejerlar',
  '/teachers': 'Oʻqituvchilar',
  '/students': 'Oʻquvchilar',
  '/teaching-assignments': 'Ustozni biriktirish',
  '/enrollments': 'Oʻquvchini guruhga qoʻshish',
  '/groups': 'Guruhlar',
  '/rooms': 'Xonalar',
  '/attendance': 'Davomat',
  '/profile': 'Mening Profilim',
};

export const Header = () => {
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

  const currentPageTitle = routeTitles[location.pathname] || 'Zarbdor CRM';

  const formattedDate = new Date().toLocaleDateString('en-en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="h-20 bg-[color-mix(in_srgb,var(--card)_45%,transparent)] backdrop-blur-xl border-b border-[color-mix(in_srgb,var(--border)_40%,transparent)] px-8 flex items-center justify-between sticky top-0 z-10 transition-all duration-300">
      
      {/* CHAP TOMON: SAHIFA NOMI VA SANA */}
      <div className="flex items-center gap-5">
        <h1 className="text-xl font-black text-text-main tracking-tight select-none border-l-4 border-primary pl-3">
          {currentPageTitle}
        </h1>
      </div>
      
      {/* O'NG TOMON: FAQAT THEME TOGGLER QOLDI (Toza dizayn) */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-[color-mix(in_srgb,var(--background)_80%,transparent)] border border-[color-mix(in_srgb,var(--border)_60%,transparent)] text-text-muted hover:text-primary hover:border-primary/40 transition-all duration-200 cursor-pointer"
          aria-label="Mavzuni o'zgartirish"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="hidden md:flex items-center text-text-muted gap-2.5 bg-[color-mix(in_srgb,var(--background)_60%,transparent)] px-3.5 py-1.5 rounded-xl border border-[color-mix(in_srgb,var(--border)_30%,transparent)]">
          <Calendar size={14} className="text-primary" />
          <span className="text-[11px] font-bold tracking-wide">
            Bugun: <span className="text-text-main font-extrabold">{formattedDate}</span>
          </span>
        </div>
      </div>

    </header>
  );
};