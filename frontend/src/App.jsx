import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import { ThemeProvider } from '@context/ThemeContext';
import { Layout } from '@components/layout/Layout';
import {
  HomePage,
  WelcomePage,
  SearchPage,
  SavedPage,
  ProfilePage,
  LoginPage,
  RegisterPage,
} from '@pages';

/**
 * Main App Component - REDESIGNED ROUTING
 */
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes with Layout */}
            <Route element={<Layout />}>
              {/* Home is now the recipe discovery page */}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              
              {/* Recipe Detail Page (Optional - can be added later) */}
              {/* <Route path="/recipe/:id" element={<RecipeDetailPage />} /> */}
            </Route>

            {/* Catch all - Redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;