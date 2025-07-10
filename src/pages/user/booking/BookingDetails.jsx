// src/pages/user/booking/BookingDetails.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../../../api/axios'; // Updated import path
import { AuthContext } from '../../../context/AuthContext'; // Import AuthContext

const BookingDetails = ({ bookingId, onClose, onBookingUpdated, onBookingDeleted }) => {
  const { user } = useContext(AuthContext);
  const currentUserId = user?.id;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState('');

  // State for editing
  const [editBookingDate, setEditBookingDate] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const fetchBookingDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      // Ensure the booking belongs to the current user
      if (response.data.userId !== currentUserId) {
        setError('You are not authorized to view this booking.');
        setBooking(null); // Clear booking data
        return;
      }
      setBooking(response.data);
      setEditBookingDate(response.data.bookingDate);
      setEditStatus(response.data.status);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication required to view booking details. Please log in.');
      } else if (err.response && err.response.status === 404) {
        setError('Booking not found.');
      } else {
        setError(err.response?.data?.message || 'Failed to load booking details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId && currentUserId) { // Fetch only if bookingId and currentUserId are available
      fetchBookingDetails();
    }
  }, [bookingId, currentUserId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!booking || booking.userId !== currentUserId) {
      setError('You are not authorized to update this booking.');
      return;
    }
    try {
      // Only allow user to change status to CANCELLED, or date if allowed by backend
      // For simplicity, we'll send all fields, but backend should validate user permissions
      const payload = {
        userId: booking.userId, // Keep original user ID
        vehicleId: booking.vehicleId, // Keep original vehicle ID
        serviceCenterId: booking.serviceCenterId, // Keep original service center ID
        bookingDate: editBookingDate,
        status: editStatus,
      };
      const response = await api.put(`/bookings/${bookingId}`, payload);
      setBooking(response.data);
      setIsEditing(false);
      onBookingUpdated();
      setSuccess('Booking updated successfully!');
    } catch (err) {
      console.error('Error updating booking:', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication required to update booking. Please log in.');
      } else {
        setError(err.response?.data?.message || 'Failed to update booking.');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setError('');
      setSuccess('');
      if (!booking || booking.userId !== currentUserId) {
        setError('You are not authorized to delete this booking.');
        return;
      }
      try {
        await api.delete(`/bookings/${bookingId}`);
        onBookingDeleted();
        onClose();
      } catch (err) {
        console.error('Error deleting booking:', err);
        if (err.response && err.response.status === 401) {
          setError('Authentication required to delete booking. Please log in.');
        } else {
          setError(err.response?.data?.message || 'Failed to delete booking.');
        }
      }
    }
  };

  if (loading) return <p>Loading booking details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!booking) return <p>No booking selected or booking not found for this user.</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Booking (ID: {booking.id})</h2>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Close
        </button>
      </div>

      {success && <p className="text-green-500 mb-2">{success}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {!isEditing ? (
        <div className="space-y-2">
          <p><strong>Vehicle ID:</strong> {booking.vehicleId}</p>
          <p><strong>Service Center ID:</strong> {booking.serviceCenterId}</p>
          <p><strong>Booking Date:</strong> {booking.bookingDate}</p>
          <p><strong>Status:</strong> {booking.status}</p>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              Edit Booking
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          {/* User can only modify date and status, other fields are fixed for existing booking */}
          <div>
            <label htmlFor="editBookingDate" className="block text-sm font-medium text-gray-700">Booking Date</label>
            <input
              type="date"
              id="editBookingDate"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={editBookingDate}
              onChange={(e) => setEditBookingDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="editStatus" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="editStatus"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              required
            >
              {/* User might only be able to change to CANCELLED */}
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookingDetails;
