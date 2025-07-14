import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [message, setMessage] = useState(''); // State for messages (success/error)
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setMessageType('');
    try {
      const res = await api.post(
        '/auth/register',           // endpoint
        { email, password },       // body payload
        { params: { role } }       // query parameter
      );
      console.log(res.data.token);
      setMessage('Registered successfully! Please log in.');
      setMessageType('success');
      setTimeout(() => {
        nav('/login');
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      console.error(err);
      setMessage('Registration failed: ' + (err.response?.data?.message || err.message));
      setMessageType('error');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-end pt-0 pb-0 px-4 md:px-8 lg:px-12">
      {/* Full-screen Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-200 text-gray-70 pt-0 pb-0 px-8 md:px-12 lg:px-16 flex items-center justify-start">
        <div className="max-w-xl md:ml-16 lg:ml-32 pr-4 md:pr-0">
          <h2 className="text-5xl md:text-4xl font-extrabold mb-4 md:mb-6 font-sans drop-shadow-lg animate-fade-in">
            Join Our Community!
          </h2>
          <p className="text-base md:text-lg italic mb-6 md:mb-8 leading-relaxed text-left drop-shadow-md animate-slide-up">
            "Unlock seamless vehicle management and expert service at your fingertips. Your journey, our commitment."
          </p>
          <div className="space-y-4 md:space-y-6 text-left">
            <img
              src="https://placehold.co/400x250/ADD8E6/000000?text=Expert+Mechanic"
              alt="Expert Mechanic"
              className="rounded-xl shadow-2xl w-full h-auto max-w-sm md:max-w-md transform hover:scale-105 transition-transform duration-500 ease-in-out animate-zoom-in"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x250/ADD8E6/000000?text=Image+Load+Error'; }}
            />
            <p className="text-sm md:text-base font-light drop-shadow-sm animate-fade-in-delay">
              Register now to manage your vehicles and book services with ease.
            </p>
          </div>
        </div>
      </div>

      {/* Registration Form Card - positioned on top and to the right */}
      <div className="relative z-10 bg-blue-50/95 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8 w-full max-w-xs md:max-w-sm animate-fade-in-right">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-sans text-gray-800 text-center">Register</h2>
          {message && (
            <p className={`mb-3 text-sm text-center ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full p-3 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full p-3 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="role" className="sr-only">Role</label>
            <select
              id="role"
              className="w-full p-3 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
          >
            Register
          </button>
          <p className="mt-4 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
