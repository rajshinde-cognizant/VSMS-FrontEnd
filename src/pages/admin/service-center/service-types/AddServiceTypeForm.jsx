// src/components/service-center/service-types/AddServiceTypeForm.jsx
import React, { useState } from 'react';
import api from '../../../../api/axios';

const AddServiceTypeForm = ({ onServiceTypeAdded, serviceCenterId }) => {
  const [description, setDescription] = useState(''); // Changed from name
  const [price, setPrice] = useState('');           // Added price
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // The token is now automatically attached by the Axios interceptor in api.js
      // IMPORTANT: As discussed, your backend's addServiceType expects a serviceCenterId.
      // For a standalone form, you'd need a selection mechanism or modify the backend for global service types.
      // Using a dummy ID for demonstration. Replace with actual logic.
       // **Replace with actual logic to select a service center**

      const response = await api.post(`/service-centers/${serviceCenterId}/service-types`, { description, price: parseFloat(price) }); // Updated fields, ensured price is number
      setSuccess(`Service type "${response.data.description}" added successfully!`);
      setDescription('');
      setPrice('');
      onServiceTypeAdded(); // Callback to refresh list
    } catch (err) {
      console.error('Error adding service type:', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication required. Please log in.');
      } else {
        setError(err.response?.data?.message || 'Failed to add service type. Please check your input.');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Service Type</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <div>
          <label htmlFor="serviceTypeDescription" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="serviceTypeDescription"
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="serviceTypePrice" className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number" // Use number type for price
            id="serviceTypePrice"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            step="0.01" // Allow decimal values
            min="0"    // Ensure non-negative price
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Service Type
        </button>
      </form>
    </div>
  );
};

export default AddServiceTypeForm;
