// src/pages/admin/booking/AdminCreateBookingForm.jsx
import React, { useState } from 'react';
import api from '../../../api/axios'; // Updated import path

const AdminCreateBookingForm = ({ onBookingCreated }) => {
  const [userId, setUserId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [serviceCenterId, setServiceCenterId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        userId: parseInt(userId),
        vehicleId: parseInt(vehicleId),
        serviceCenterId: parseInt(serviceCenterId),
        bookingDate,
        status,
      };
      const response = await api.post('/bookings', payload);
      setSuccess(`Booking created successfully with ID: ${response.data.id}`);
      setUserId('');
      setVehicleId('');
      setServiceCenterId('');
      setBookingDate('');
      setStatus('PENDING');
      onBookingCreated();
    } catch (err) {
      console.error('Error creating booking:', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication required. Please log in.');
      } else {
        setError(err.response?.data?.message || 'Failed to create booking. Please check your input.');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Create New Booking (Admin)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User ID</label>
          <input
            type="number"
            id="userId"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            min="1"
          />
        </div>
        <div>
          <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">Vehicle ID</label>
          <input
            type="number"
            id="vehicleId"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            required
            min="1"
          />
        </div>
        <div>
          <label htmlFor="serviceCenterId" className="block text-sm font-medium text-gray-700">Service Center ID</label>
          <input
            type="number"
            id="serviceCenterId"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={serviceCenterId}
            onChange={(e) => setServiceCenterId(e.target.value)}
            required
            min="1"
          />
        </div>
        <div>
          <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">Booking Date</label>
          <input
            type="date"
            id="bookingDate"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Booking
        </button>
      </form>
    </div>
  );
};

export default AdminCreateBookingForm;
