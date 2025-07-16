// src/auth/Login.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Ensure jwt-decode is installed: npm install jwt-decode

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for displaying error messages
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const res = await api.post("/auth/login", { email, password });
      console.log("Login response:", res.data);
      const { token } = res.data;

      const payload = jwtDecode(token);
      console.log("JWT Payload:", payload); // IMPORTANT: Inspect this to find the actual user ID claim

      const userId = payload.sub; // Assuming 'sub' claim holds the numeric user ID

      if (!userId) {
        setError("User ID not found in token payload.");
        return;
      }

      // Pass token, id, role, and email to the login context
      login({ token, id: userId, role: payload.role, email: payload.email });

      // Navigate based on role
      payload.role === "ADMIN"
        ? nav("/admin/dashboard")
        : nav("/user/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-end pt-0 pb-0 px-4 md:px-8 lg:px-12">
      {/* Full-screen Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-200 text-gray-80 pt-0 pb- px-8 md:px-12 lg:px-16 flex items-center justify-start">
        <div className="max-w-xl md:ml-16 lg:ml-32 pr-4 md:pr-0">
          <h2 className="text-5xl md:text-4xl font-extrabold mb-4 md:mb-6 font-sans drop-shadow-lg animate-fade-in">
            Your Vehicle, Our Priority!
          </h2>
          <p className="text-base md:text-lg italic mb-6 md:mb-8 leading-relaxed text-left drop-shadow-md animate-slide-up">
            "Experience unparalleled vehicle care and seamless service bookings. We're dedicated to keeping your ride smooth and safe."
          </p>
          <div className="space-y-4 md:space-y-6 text-left">
            <img
              src="https://placehold.co/400x250/ADD8E6/000000?text=Premium+Car+Service"
              alt="Premium Car Service"
              className="rounded-xl shadow-2xl w-full h-auto max-w-sm md:max-w-md transform hover:scale-105 transition-transform duration-500 ease-in-out animate-zoom-in"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x250/ADD8E6/000000?text=Image+Load+Error'; }}
            />
            <p className="text-sm md:text-base font-light drop-shadow-sm animate-fade-in-delay">
              From routine maintenance to complex repairs, trust us to deliver excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Login Form Card - positioned on top and to the right */}
      <div className="relative z-10 bg-blue-50/95 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8 w-full max-w-xs md:max-w-sm animate-fade-in-right">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-sans text-gray-800 text-center">Login</h2>
          {error && <p className="text-red-500 mb-3 text-sm text-center">{error}</p>}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full p-3 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
          >
            Login
          </button>
          <p className="mt-4 text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline font-medium">
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
