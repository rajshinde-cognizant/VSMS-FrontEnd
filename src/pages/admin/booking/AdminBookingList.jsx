// src/pages/admin/booking/AdminBookingList.jsx
import React, { useEffect, useState } from 'react';
import api from '../../../api/axios'; // Updated import path
import AdminBookingDetails from './AdminBookingDetails'; // Import AdminBookingDetails

const AdminBookingList = ({ refreshTrigger }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState(0); // Initialize with 0 or null

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/bookings'); // Fetches all bookings
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication required to list bookings. Please log in.');
      } else {
        setError(err.response?.data?.message || 'Failed to load bookings.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [refreshTrigger]);

  const handleViewDetails = (id) => {
    // Corrected: Set selectedBookingId to the actual booking's ID
    setSelectedBookingId(Number(id));
    // console.log("Selected Booking ID:", Number(id)); // Log the correct ID
  };

  const handleCloseDetails = () => {
    setSelectedBookingId(0); // Reset to 0 or null to hide details
    fetchBookings(); // Refresh list after closing details (in case of update/delete)
  };

  const handleBookingUpdated = () => {
    fetchBookings(); // Refresh list after a booking is updated
  };

  const handleBookingDeleted = () => {
    fetchBookings(); // Refresh list after a booking is deleted
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">All Bookings (Admin View)</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((booking) => (
            <li key={booking.id} className="border p-4 rounded-md flex justify-between items-center">
              <div>
                <p className="font-medium">Booking ID: {booking.id}</p>
                {/* Displaying user name from nested object */}
                <p className="text-sm text-gray-600">User: {booking.user.name} | Vehicle: {booking.vehicleId} | Service Center: {booking.serviceCenterId}</p>
                <p className="text-sm text-gray-600">Date: {booking.bookingDate} | Status: {booking.status}</p>
              </div>
              <button
                // FIX: Pass booking.id, not booking.user.id
                onClick={() => handleViewDetails(booking.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Only render AdminBookingDetails if selectedBookingId is a truthy value (i.e., not 0) */}
      {selectedBookingId !== 0 && (
        <AdminBookingDetails
          bookingId={selectedBookingId}
          onClose={handleCloseDetails}
          onBookingUpdated={handleBookingUpdated}
          onBookingDeleted={handleBookingDeleted}
        />
      )}
    </div>
  );
};

export default AdminBookingList;
