// src/pages/user/booking/BookingList.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../../../api/axios';
import BookingDetails from './BookingDetails'; // Assuming this is for editing/viewing booking details
import { AuthContext } from '../../../context/AuthContext';
import InvoiceDetailsModal from '../../common/InvoiceDetailsModal'; // Import the new modal

const BookingList = ({ refreshTrigger }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const currentUserEmail = user?.id; // Get user email from AuthContext

  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]); // New state to store user's invoices
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null); // New state for selected invoice

  const fetchBookingsAndInvoices = async () => {
    setLoading(true);
    setError('');
    if (authLoading) {
      return;
    }
    if (!user || !currentUserEmail) {
      setError('User not logged in or user email not available. Please log in.');
      setLoading(false);
      return;
    }
    try {
      // Fetch bookings specific to the logged-in user by email
      const bookingsResponse = await api.get(`/bookings/user/search?email=${currentUserEmail}`);
      setBookings(bookingsResponse.data);

      // Fetch invoices specific to the logged-in user by email
      const invoicesResponse = await api.get(`/invoices/user/search?email=${currentUserEmail}`);
      setInvoices(invoicesResponse.data);

    } catch (err) {
      console.error('Error fetching user data (bookings/invoices):', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication required to list your data. Please log in.');
      } else {
        setError(err.response?.data?.message || 'Failed to load your bookings or invoices.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && currentUserEmail) {
      fetchBookingsAndInvoices();
    }
  }, [currentUserEmail, refreshTrigger, authLoading]);

  const handleViewBookingDetails = (id) => {
    setSelectedBookingId(id);
  };

  const handleCloseBookingDetails = () => {
    setSelectedBookingId(null);
    fetchBookingsAndInvoices(); // Refresh list after closing details (in case of update/delete)
  };

  const handleBookingUpdated = () => {
    fetchBookingsAndInvoices(); // Refresh list after a booking is updated
  };

  const handleBookingDeleted = () => {
    fetchBookingsAndInvoices(); // Refresh list after a booking is deleted
  };

  const handleViewInvoiceDetails = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
  };

  const handleCloseInvoiceDetails = () => {
    setSelectedInvoiceId(null);
    // No need to re-fetch bookings/invoices here unless invoice status can change from modal
  };

  if (loading) return <p>Loading your bookings and invoices...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6">
      <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <table className="w-full border-collapse rounded-lg shadow-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-2 py-4 text-left text-sm">Booking ID</th>
              <th className="px-2 py-4 text-left text-sm">Vehicle</th>
              <th className="px-2 py-4 text-left text-sm">Service Center</th>
              <th className="px-2 py-4 text-left text-sm">Date</th>
              <th className="px-2 py-4 text-left text-sm">Status</th>
              <th className="px-2 py-4 text-left text-sm">Payment Status</th>
              <th className="px-2 py-4 text-center text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => {
              const associatedInvoice = invoices.find(
                (inv) => inv.booking && inv.booking.id === booking.id
              );

              return (
                <tr
                  key={booking.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition-colors`}
                >
                  <td className="px-4 py-2 text-gray-800">{booking.id}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {booking.vehicle ? booking.vehicle.make : booking.vehicleId}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {booking.serviceCenter
                      ? booking.serviceCenter.name
                      : booking.serviceCenterId}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{booking.bookingDate}</td>
                  <td className="px-4 py-2 text-gray-600">{booking.status}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {associatedInvoice ? (
                      <>
                        {associatedInvoice.paymentStatus}
                      </>
                    ) : (
                      "UNPAID"
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {associatedInvoice && (
                      <button
                        onClick={() =>
                          handleViewInvoiceDetails(associatedInvoice.invoiceId)
                        }
                        className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                      >
                        View Invoice
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {selectedInvoiceId && (
        <InvoiceDetailsModal
          invoiceId={selectedInvoiceId}
          onClose={handleCloseInvoiceDetails}
        />
      )}
    </div>
  );
};

export default BookingList;