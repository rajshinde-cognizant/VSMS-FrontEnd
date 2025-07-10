import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { decodeJWT } from '../../utils/jwt';
 
const UserProfile = () => {
  const [token] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token;
  });
 
  const [profile, setProfile] = useState({
    email: '',
    name: '',
    phone: '',
    address: ''
  });
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
 
    if (token) fetchProfile();
  }, [token]);
 
  const handleChange = (e) => {
const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Email is extracted from token, no need to send again in body
await api.post('/users/me', profile);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Profile update failed!');
    }
  };
 
  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;
 
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email (readonly) */}
        <div>
          <label className="block mb-1 text-gray-700">Email</label>
          <input
            type="email"
            name="email"
value={profile.email}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
 
        {/* Name */}
        <div>
          <label className="block mb-1 text-gray-700">Name</label>
          <input
            type="text"
            name="name"
value={profile.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
 
        {/* Phone */}
        <div>
          <label className="block mb-1 text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
value={profile.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
 
        {/* Address */}
        <div>
          <label className="block mb-1 text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
 
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};
 
export default UserProfile;