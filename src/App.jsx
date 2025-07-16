import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
 
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
 
import Login from './auth/Login';
import Register from './auth/Register';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Unauthorized from './pages/common/Unauthorized';
 
function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
 
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>
 
          {/* User-only routes */}
          <Route
            element={
              <ProtectedRoute role="CUSTOMER">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/user/dashboard" element={<UserDashboard />} />
            {/* Other user pages go here */}
          </Route>
 
          {/* Admin-only routes */}
          <Route
            element={
              <ProtectedRoute role="ADMIN">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* Other admin pages go here */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
 
export default App;

