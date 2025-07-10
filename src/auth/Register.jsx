import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
 
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const nav = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();    
    try {
      const res = await api.post(
        '/auth/register',           // endpoint
        { email, password },       // body payload
        { params: { role } }       // query parameter
      );
      console.log(res.data.token);
      alert('Registered! Token received.');
      nav('/login');
    } catch (err) {
      console.error(err);
      alert('Registration failed: ' + (err.response?.data?.message || err.message));
    }
  };
 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 font-sans">Register</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          className="w-full p-2 border mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit" className="w-full bg-[var(--color-secondary)] text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};
 
export default Register;
 