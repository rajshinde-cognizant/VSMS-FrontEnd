// src/pages/admin/booking/AdminBookingDetails.jsx
import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import ConfirmationModal from '../../common/ConfirmationModal'; // Assuming you have this modal

const AdminBookingDetails = ({ bookingId, onClose, onBookingUpdated, onBookingDeleted }) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState('');

  // State for editing
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editVehicleId, setEditVehicleId] = useState('');
  const [editServiceCenterId, setEditServiceCenterId] = useState('');
  const [editBookingDate, setEditBookingDate] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false); // For delete confirmation
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false); // New state for invoice generation
  const [invoiceMessage, setInvoiceMessage] = useState(''); // New state for invoice feedback

  const fetchBookingDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      setBooking(response.data);

      // Set initial state for editing from response data
      setEditUserEmail(response.data.user ? response.data.user.email : '');
      setEditVehicleId(response.data.vehicleId);
      setEditServiceCenterId(response.data.serviceCenterId);
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
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setInvoiceMessage(''); // Clear previous invoice messages

    const originalStatus = booking.status; // Store original status

    try {
      const payload = {
        userEmail: editUserEmail,
        vehicleId: parseInt(editVehicleId),
        serviceCenterId: parseInt(editServiceCenterId),
        bookingDate: editBookingDate,
        status: editStatus,
      };
      const response = await api.put(`/bookings/${bookingId}`, payload);
      setBooking(response.data);
      setIsEditing(false);
      onBookingUpdated();
      setSuccess('Booking updated successfully!');

      // --- New Logic for Invoice Generation ---
      // Check if status changed to 'COMPLETED'
      if (originalStatus !== 'COMPLETED' && editStatus === 'COMPLETED') {
        await generateInvoiceForBooking(bookingId, response.data); // Pass updated booking data
      }
      // --- End New Logic ---

    } catch (err) {
      console.error('Error updating booking:', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication required to update booking. Please log in.');
      } else {
        setError(err.response?.data?.message || 'Failed to update booking.');
      }
    }
  };

  const generateInvoiceForBooking = async (bookingIdToInvoice, bookingData) => {
    setIsGeneratingInvoice(true);
    setInvoiceMessage('');
    try {
      // IMPORTANT: bookingData.serviceTypeId is assumed to exist in your BookingResponse.
      // If not, you need to adjust your booking-service to include it,
      // or fetch it here using bookingData.serviceCenterId if possible.
      if (!bookingData.serviceTypeId) {
        setInvoiceMessage('Error: Service Type ID missing from booking data. Cannot generate invoice.');
        console.error('Service Type ID missing from booking data for invoice generation.');
        return;
      }

      const invoicePayload = {
        bookingId: bookingIdToInvoice,
        serviceTypeId: bookingData.serviceTypeId, // Assuming this field exists in BookingResponse
      };
      const invoiceResponse = await api.post('/invoices', invoicePayload);
      setInvoiceMessage(`Invoice generated successfully! Invoice ID: ${invoiceResponse.data.invoiceId}`);
      console.log('Invoice generated:', invoiceResponse.data);
    } catch (err) {
      console.error('Error generating invoice:', err);
      setInvoiceMessage(`Failed to generate invoice: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };


  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmModal(false);
    setError('');
    setSuccess('');
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
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  if (loading) return <p>Loading booking details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!booking) return <p>No booking selected or booking not found.</p>;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Booking Details (ID: {booking.id})</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>

        {success && <p className="text-green-500 mb-2">{success}</p>}
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {isGeneratingInvoice && <p className="text-blue-500 mb-2">Generating invoice...</p>}
        {invoiceMessage && (
          <p className={`mb-2 ${invoiceMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {invoiceMessage}
          </p>
        )}

        {!isEditing ? (
          <div className="space-y-2">
            <p><strong>User ID:</strong> {booking.user ? booking.user.id : 'N/A'}</p>
            <p><strong>User Name:</strong> {booking.user ? booking.user.name : 'N/A'}</p>
            <p><strong>User Email:</strong> {booking.userEmail}</p>
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
                onClick={handleDeleteClick}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Booking
              </button>
              {/* Optional: Manual Generate Invoice button for completed bookings */}
              {booking.status === 'COMPLETED' && !invoiceMessage.includes('Invoice ID') && (
                <button
                  onClick={() => generateInvoiceForBooking(booking.id, booking)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  disabled={isGeneratingInvoice}
                >
                  {isGeneratingInvoice ? 'Generating...' : 'Generate Invoice'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label htmlFor="editUserEmail" className="block text-sm font-medium text-gray-700">User Email</label>
              <input
                type="email"
                id="editUserEmail"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={editUserEmail}
                onChange={(e) => setEditUserEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="editVehicleId" className="block text-sm font-medium text-gray-700">Vehicle ID</label>
              <input
                type="number"
                id="editVehicleId"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={editVehicleId}
                onChange={(e) => setEditVehicleId(e.target.value)}
                required
                min="1"
              />
            </div>
            <div>
              <label htmlFor="editServiceCenterId" className="block text-sm font-medium text-gray-700">Service Center ID</label>
              <input
                type="number"
                id="editServiceCenterId"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={editServiceCenterId}
                onChange={(e) => setEditServiceCenterId(e.target.value)}
                required
                min="1"
              />
            </div>
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

      {showConfirmModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this booking?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default AdminBookingDetails;


