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

      // Attempt to get userId from 'sub' claim.
      // If your backend puts the actual database ID of the user in a different claim (e.g., 'userId'),
      // replace `payload.sub` with `payload.userId` or whatever it's named.
      const userId = payload.sub; // Assuming 'sub' claim holds the numeric user ID

      if (!userId) {
        setError("User ID not found in token payload. Please check JWT structure or backend configuration.");
        return;
      }

      // Pass the numeric userId along with token, role, and email to the login context
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4 font-sans">Login</h2>
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3 rounded-md"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3 rounded-md"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;




