// src/components/service-center/ServiceCenterForm.jsx
import React, { useState } from 'react';
import api from '../../../api/axios';

const ServiceCenterForm = ({ onServiceCenterAdded }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState(''); // Changed from address
  const [contact, setContact] = useState('');   // Changed from phone
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // The token is now automatically attached by the Axios interceptor in api.js
      const response = await api.post('/service-centers', { name, location, contact }); // Updated fields
      setSuccess(`Service center "${response.data.name}" added successfully!`);
      setName('');
      setLocation('');
      setContact('');
      onServiceCenterAdded(); // Callback to refresh list
    } catch (err) {
      console.error('Error adding service center:', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication required. Please log in.');
      } else {
        setError(err.response?.data?.message || 'Failed to add service center. Please check your input.');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Service Center</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
          <input
            type="text"
            id="contact"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Service Center
        </button>
      </form>
    </div>
  );
};

export default ServiceCenterForm;
