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
    <div>
      <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-6 py-3 text-left font-medium">Booking ID</th>
              <th className="px-6 py-3 text-left font-medium">User</th>
              <th className="px-6 py-3 text-left font-medium">Vehicle</th>
              <th className="px-6 py-3 text-left font-medium">Service Center</th>
              <th className="px-6 py-3 text-left font-medium">Date</th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr
                key={booking.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200 transition-colors`}
              >
                <td className="px-2 py-3 text-sm text-gray-800 text-center">{booking.id}</td>
                <td className="px-2 py-3 text-sm text-gray-600 text-center">{booking.user.name}</td>
                <td className="px-2 py-3 text-sm text-gray-600 text-center">{booking.vehicleId}</td>
                <td className="px-2 py-3 text-sm text-gray-600 text-center">{booking.serviceCenterId}</td>
                <td className="px-2 py-3 text-sm text-gray-600 text-center">{booking.bookingDate}</td>
                <td className="px-2 py-3 text-sm text-gray-600 text-center">{booking.status}</td>
                <td className="px-2 py-3 text-center">
                  <button
                    onClick={() => handleViewDetails(booking.id)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
