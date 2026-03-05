import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { Toaster } from 'react-hot-toast';

/**
 * Main Layout Component
 */
export const Layout = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Top Navbar (Desktop) */}
      <Navbar />

      {/* Main Content */}
      <main className="pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />

      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1E1E1E',
            color: '#fff',
            border: '1px solid #2A2A2A',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#FF7A00',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};