import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RoleGuard } from './RoleGuard';
import { LoginPage } from '../../features/auth/pages/loginPage';
import MainLayout from '../../components/layout/MainLayout';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage';
import { ProfilePage } from '../../features/profiles/pages/ProfilePage';
import { TeachersPage } from '../../features/teachers/pages/TeachersPage';
import { ManagersPage } from '../../features/manager/page/ManagersPage';
import { StudentsPage } from '../../features/students/pages/StudentsPage';
import { RoomsPage } from '../../features/rooms/pages/RoomsPage';
import { GroupsPage } from '../../features/groups/pages/GroupPages';
import { TeachingAssignmentsPage } from '../../features/teaching-assignment/Page/TeachAssignPage';
import { EnrollmentsPage } from '../../features/enrollments/page/EnrollmentsPage';

// 💰 Haqiqiy Moliya sahifasini import qilamiz (skrinshotdagi tuzilma bo'yicha)
import { FinancePage } from '../../features/finance/pages/FinancePage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <RoleGuard />, 
    children: [
      {
        element: <MainLayout />, 
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          
          {
            element: <RoleGuard allowedRoles={['ADMIN']} />,
            children: [
              { path: 'managers', element: <ManagersPage /> },
            ],
          },
          
          {
            element: <RoleGuard allowedRoles={['ADMIN', 'MANAGER']} />,
            children: [
              { path: 'groups', element: <GroupsPage /> },
              { path: 'students', element: <StudentsPage /> },
              { path: 'teachers', element: <TeachersPage /> },
              { path: 'rooms', element: <RoomsPage /> },
              { path: 'teaching-assignments', element: <TeachingAssignmentsPage /> },
              { path: 'enrollments', element: <EnrollmentsPage /> },
              
              // 💰 Vaqtinchalik div o'rniga haqiqiy sahifani ulaymiz:
              { path: 'finance', element: <FinancePage /> },
            ],
          },

          {
            element: <RoleGuard allowedRoles={['TEACHER']} />,
            children: [
              { path: 'attendance', element: <div className="p-6 text-text-main">Davomat sahifasi</div> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/unauthorized',
    element: (
      <div className="h-screen flex flex-col items-center justify-center bg-background text-center p-4">
        <h1 className="text-4xl font-extrabold text-red-500 mb-2">403 - Ruxsat yo'q</h1>
        <p className="text-text-muted max-w-sm">Sizning profilingiz orqali ushbu sahifaga kirish taqiqlangan!</p>
        <a href="/dashboard" className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">Dashboardga qaytish</a>
      </div>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);