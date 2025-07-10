// src/components/service-center/AddMechanicForm.jsx
import React, { useState } from 'react';
    import api from '../../../api/axios';
    
    const AddMechanicForm = ({ serviceCenterId, onMechanicAdded }) => {
      const [name, setName] = useState('');
      const [expertise, setExpertise] = useState(''); // Changed from specialization, removed contactInfo
      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
          // The token is now automatically attached by the Axios interceptor in api.js
          const response = await api.post(`/service-centers/${serviceCenterId}/mechanics`, {
            name,
            expertise, // Updated field
          });
          setSuccess(`Mechanic "${response.data.name}" added successfully!`);
          setName('');
          setExpertise('');
          onMechanicAdded(); // Callback to refresh mechanics list
        } catch (err) {
          console.error('Error adding mechanic:', err);
          if (err.response && err.response.status === 401) {
            setError('Authentication required. Please log in.');
          } else {
            setError(err.response?.data?.message || 'Failed to add mechanic. Please check your input.');
          }
        }
      };
    
      return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-3">Add New Mechanic</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <div>
              <label htmlFor="mechanicName" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="mechanicName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">Expertise</label>
              <input
                type="text"
                id="expertise"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add Mechanic
            </button>
          </form>
        </div>
      );
    };
    
    export default AddMechanicForm;
    