// // src/pages/user/booking/BookingList.jsx
// import React, { useEffect, useState, useContext } from 'react';
// import api from '../../../api/axios';
// import BookingDetails from './BookingDetails';
// import { AuthContext } from '../../../context/AuthContext';

// const BookingList = ({ refreshTrigger }) => {
//   const { user, loading: authLoading } = useContext(AuthContext);
//   const currentUserEmail = user?.id; // Get user email from AuthContext

//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedBookingId, setSelectedBookingId] = useState(null);

//   const fetchBookings = async () => {
//     setLoading(true);
//     setError('');
//     if (authLoading) {
//       return; // Wait for auth context to load
//     }
//     if (!user || !currentUserEmail) { // Ensure user and currentUserEmail are available
//       setError('User not logged in or user email not available. Please log in.');
//       setLoading(false);
//       return;
//     }
//     try {
//       // CORRECTED ENDPOINT: Fetch bookings specific to the logged-in user by email
//       const response = await api.get(`/bookings/user/search?email=${currentUserEmail}`);
//       setBookings(response.data);
//     } catch (err) {
//       console.error('Error fetching user bookings:', err);
//       if (err.response && err.response.status === 401) {
//         setError('Authentication required to list your bookings. Please log in.');
//       } else if (err.response && err.response.status === 403) {
//         setError('Permission denied to list your bookings. Ensure your user account has access.');
//       } else {
//         setError(err.response?.data?.message || 'Failed to load your bookings.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!authLoading && currentUserEmail) { // Fetch only if auth is not loading and email is available
//       fetchBookings();
//     }
//   }, [currentUserEmail, refreshTrigger, authLoading]); // Depend on currentUserEmail, refreshTrigger, and authLoading

//   const handleCloseDetails = () => {
//     setSelectedBookingId(null);
//     fetchBookings();
//   };

//   const handleBookingUpdated = () => {
//     fetchBookings();
//   };

//   const handleBookingDeleted = () => {
//     fetchBookings();
//   };

//   if (loading) return <p>Loading your bookings...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
//       {bookings.length === 0 ? (
//         <p>You have no bookings yet.</p>
//       ) : (
//         <ul className="space-y-3">
//           {bookings.map((booking) => (
//             <li key={booking.id} className="border p-4 rounded-md flex justify-between items-center">
//               <div>
//                 <p className="font-medium">Booking ID: {booking.id}</p>
//                 <p className="text-sm text-gray-600">Vehicle: {booking.vehicleId} | Service Center: {booking.serviceCenterId}</p>
//                 <p className="text-sm text-gray-600">Date: {booking.bookingDate} | Status: {booking.status}</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       {selectedBookingId && (
//         <BookingDetails
//           bookingId={selectedBookingId}
//           onClose={handleCloseDetails}
//           onBookingUpdated={handleBookingUpdated}
//           onBookingDeleted={handleBookingDeleted}
//         />
//       )}
//     </div>
//   );
// };

// export default BookingList;

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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((booking) => {
            // Find if an invoice exists for this booking
            const associatedInvoice = invoices.find(inv => inv.booking && inv.booking.id === booking.id);

            return (
              <li key={booking.id} className="border p-4 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-medium">Booking ID: {booking.id}</p>
                  <p className="text-sm text-gray-600">Vehicle: {booking.vehicle ? booking.vehicle.make : booking.vehicleId} | Service Center: {booking.serviceCenter ? booking.serviceCenter.name : booking.serviceCenterId}</p>
                  <p className="text-sm text-gray-600">Date: {booking.bookingDate} | Status: {booking.status}</p>
                  {associatedInvoice && (
                    <p className="text-xs text-gray-500 mt-1">Invoice ID: {associatedInvoice.invoiceId} | Status: {associatedInvoice.paymentStatus}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {/* <button
                    onClick={() => handleViewBookingDetails(booking.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    View Booking
                  </button> */}
                  {associatedInvoice && (
                    <button
                      onClick={() => handleViewInvoiceDetails(associatedInvoice.invoiceId)}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      View Invoice
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* {selectedBookingId && (
        <BookingDetails
          bookingId={selectedBookingId}
          onClose={handleCloseBookingDetails}
          onBookingUpdated={handleBookingUpdated}
          onBookingDeleted={handleBookingDeleted}
        />
      )} */}

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
