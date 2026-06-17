import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-background text-text-main">
      {/* Chap tomondagi doimiy menyu (fixed) */}
      <Sidebar />
      
      {/* O'ng tomondagi asosiy kontent hududi.
        ml-64 qo'shildi: sidebar fiksirlangani uchun kontent uning ostida qolib ketmasligini ta'minlaydi.
      */}
      <div className="flex-1 flex flex-col min-w-0 ml-64">
        <Header />
        
        {/* Ichki sahifalar yuklanadigan joy */}
        <main className="flex-1 p-6 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;