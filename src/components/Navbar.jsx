// src/components/Navbar.jsx
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
 
export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();
 
  const onLogout = () => {
    logout();
    nav('/login');
  };
 
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg"> {/* Changed background to a darker gray for contrast */}
      <Link to="/" className="font-bold uppercase text-xl tracking-wider hover:text-blue-300 transition-colors duration-200">VSM System</Link>
      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            {user.role === 'ADMIN'
              ? <Link to="/admin/dashboard" className="text-gray-200 hover:text-blue-300 transition-colors duration-200 px-3 py-1 rounded-md">Admin Dashboard</Link>
              : <Link to="/user/dashboard" className="text-gray-200 hover:text-blue-300 transition-colors duration-200 px-3 py-1 rounded-md">User Dashboard</Link>
            }
            <button 
              onClick={onLogout} 
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 ease-in-out shadow-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 text-blue-300 border border-blue-300 rounded-md hover:bg-blue-300 hover:text-gray-800 transition duration-200 ease-in-out">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 ease-in-out">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
