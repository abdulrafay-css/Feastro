/**
 * App Component (Advanced Version)
 * Using centralized route configuration
 */

import { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useOnboarding } from './context/OnboardingContext';
import { useIsMobile } from './hooks/useMediaQuery';
import { routes, getCurrentRoute } from './routes';

// Layout Components
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import Loader from './components/common/Loader';

// Onboarding
import OnboardingFlow from './components/onboarding/OnboardingFlow';

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-bg-primary">
    <Loader type="spinner" size="xl" />
  </div>
);

function App() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { showOnboarding, isOnboardingComplete } = useOnboarding();

  // Mock authentication - replace with real auth context
  const isAuthenticated = false;
  const currentUser = {
    id: 'user-1',
    name: 'Abdul Rafay',
    username: 'abdulrafay',
    avatar: 'https://i.pravatar.cc/150?img=1',
    email: 'abdul@tecxora.com',
  };

  const currentRoute = getCurrentRoute(location.pathname);
  const hideNavigation = currentRoute?.showNav === false;

  // Update page title
  useEffect(() => {
    if (currentRoute?.title) {
      document.title = `${currentRoute.title} | Feastro`;
    } else {
      document.title = 'Feastro - Discover Recipes in Short Videos';
    }
  }, [currentRoute]);

  // Handle navigation
  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const handleTabChange = (tab) => {
    const tabRoutes = {
      home: '/',
      search: '/search',
      feed: '/feed',
      saved: '/saved',
      profile: '/profile',
    };
    window.location.href = tabRoutes[tab] || '/';
  };

  // Get active tab for bottom nav
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/search') return 'search';
    if (path === '/feed') return 'feed';
    if (path === '/saved') return 'saved';
    if (path.startsWith('/profile')) return 'profile';
    return 'home';
  };

  // Show onboarding if needed
  if (isAuthenticated && showOnboarding && !isOnboardingComplete) {
    return (
      <OnboardingFlow
        onComplete={() => {
          window.location.href = '/';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Top Navbar */}
      {isAuthenticated && !hideNavigation && (
        <Navbar
          user={currentUser}
          onLogoClick={() => handleNavigation('/')}
          onSearchClick={() => handleNavigation('/search')}
          onNotificationClick={() => console.log('Notifications')}
          onProfileClick={() => handleNavigation('/profile')}
          onLogout={() => {
            console.log('Logout');
            handleNavigation('/login');
          }}
        />
      )}

      {/* Main Content */}
      <main>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {routes.map((route) => {
                const Component = route.element;

                // Auth routes
                if (route.type === 'auth') {
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        isAuthenticated ? (
                          <Navigate to="/" replace />
                        ) : (
                          <Component />
                        )
                      }
                    />
                  );
                }

                // Private routes
                if (route.type === 'private') {
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        isAuthenticated ? (
                          <Component />
                        ) : (
                          <Navigate to="/login" replace />
                        )
                      }
                    />
                  );
                }

                // Public routes
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<Component />}
                  />
                );
              })}

              {/* Catch all */}
              <Route
                path="*"
                element={
                  <Navigate to={isAuthenticated ? '/' : '/login'} replace />
                }
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Bottom Navigation (Mobile) */}
      {isAuthenticated && !hideNavigation && isMobile && (
        <BottomNav
          activeTab={getActiveTab()}
          onTabChange={handleTabChange}
        />
      )}
    </div>
  );
}

export default App;