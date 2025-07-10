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
    <nav className="bg-[var(--color-primary)] text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold uppercase">VSM System</Link>
      <div className="space-x-4">
        {user ? (
          <>
            {user.role === 'ADMIN'
              ? <Link to="/admin/dashboard">Admin Dashboard</Link>
              : <Link to="/user/dashboard">User Dashboard</Link>
            }
            <button onClick={onLogout} className="underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
 