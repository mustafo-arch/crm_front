// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toaster } from '../ui/sonner';

const MainLayout = () => {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-background text-text-main transition-colors duration-300">
      
      {/* 🔥 AMBIENT GLOW EFFECTS */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[color-mix(in_srgb,var(--primary)_23%,transparent)] rounded-full blur-[130px] pointer-events-none animate-pulse duration-[4000ms] z-0" />
      
      <div className="absolute bottom-[5%] right-[5%] w-[600px] h-[600px] bg-[color-mix(in_srgb,#6366f1_10%,transparent)] rounded-full blur-[150px] pointer-events-none animate-pulse duration-[6000ms] z-0" />

      {/* SHAFFOF SIDEBAR */}
      <Sidebar />
      
      {/* O'NG TOMONDAGI ASOSIY BLOK */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden z-10 bg-[color-mix(in_srgb,var(--background)_40%,transparent)] backdrop-blur-[1px]">
        
        {/* Header */}
        <Header />
        
        {/* ASOSIY SAHIFALAR */}
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
        
      </div>

      {/* 🔥 SONNER GLOBAL TOAST PANELI (Shaffof oyna & X tugmasiz) */}
      <Toaster
        position="bottom-right" 
        theme="dark" 
        richColors 
        toastOptions={{
          className: "bg-[color-mix(in_srgb,var(--card)_30%,transparent)] backdrop-blur-2xl border border-[color-mix(in_srgb,var(--border)_20%,transparent)] text-text-main rounded-2xl shadow-2xl shadow-black/30",
        }}
      />
    </div>
  );
};

export default MainLayout;