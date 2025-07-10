// src/components/common/InvoiceDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/axios'; // Adjust path as needed

const InvoiceDetailsModal = ({ invoiceId, onClose }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false); // New state for status update loading
  const [statusUpdateMessage, setStatusUpdateMessage] = useState(''); // New state for status update messages

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      setLoading(true);
      setError('');
      setDownloadError('');
      setStatusUpdateMessage(''); // Clear messages on re-fetch
      try {
        const response = await api.get(`/invoices/${invoiceId}`);
        setInvoice(response.data);
      } catch (err) {
        console.error('Error fetching invoice details:', err);
        setError(err.response?.data?.message || 'Failed to load invoice details.');
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoiceDetails();
    }
  }, [invoiceId]);

  const handleDownloadInvoice = () => {
    setDownloadError('');
    if (!invoiceId) {
      setDownloadError('No invoice ID available for download.');
      return;
    }

    const downloadUrl = `${api.defaults.baseURL}/invoices/${invoiceId}/download`;
    window.open(downloadUrl, '_blank');
  };

  const handleMarkAsPaid = async () => {
    setIsUpdatingStatus(true);
    setStatusUpdateMessage('');
    setError(''); // Clear general error as well
    try {
      // Call the backend endpoint to update payment status
      const response = await api.put(`/invoices/${invoiceId}/status?status=PAID`);
      setInvoice(response.data); // Update the invoice state with the new data
      setStatusUpdateMessage('Payment status updated to PAID successfully!');
    } catch (err) {
      console.error('Error updating payment status:', err);
      if (err.response && err.response.status === 403) {
        setStatusUpdateMessage('Error: You are not authorized to change payment status. (Admin privilege required)');
      } else {
        setStatusUpdateMessage(err.response?.data?.message || 'Failed to update payment status.');
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) return <p>Loading invoice details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!invoice) return <p>No invoice selected or invoice not found.</p>;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Invoice Details (ID: {invoice.invoiceId})</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>

        {downloadError && <p className="text-red-500 mb-2">{downloadError}</p>}
        {statusUpdateMessage && (
          <p className={`mb-2 ${statusUpdateMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {statusUpdateMessage}
          </p>
        )}

        <div className="space-y-2 text-gray-700">
          <p><strong>Booking ID:</strong> {invoice.booking ? invoice.booking.id : 'N/A'}</p>
          <p><strong>User Email:</strong> {invoice.userResponse ? invoice.userResponse.email : 'N/A'}</p>
          <p><strong>Vehicle:</strong> {invoice.vehicleResponse ?  invoice.vehicleResponse.model : 'N/A'}</p>
          <p><strong>Service Type:</strong> {invoice.serviceType ? invoice.serviceType.description : 'N/A'}</p>
          <p><strong>Total Amount:</strong> ${invoice.totalAmount ? invoice.totalAmount.toFixed(2) : '0.00'}</p>
          <p><strong>Payment Status:</strong> <span className={`font-bold ${invoice.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'}`}>{invoice.paymentStatus}</span></p>
          {invoice.generationDate && <p><strong>Generated On:</strong> {invoice.generationDate}</p>}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          {/* Conditionally render "Mark as Paid" button if status is UNPAID */}
          {invoice.paymentStatus === 'UNPAID' && (
            <button
              onClick={handleMarkAsPaid}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? 'Updating...' : 'Mark as Paid'}
            </button>
          )}

          {/* Conditionally render "Download Invoice" button if status is PAID */}
          {invoice.paymentStatus === 'PAID' && (
            <button
              onClick={handleDownloadInvoice}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Download Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsModal;


// // src/components/common/InvoiceDetailsModal.jsx
// import React, { useState, useEffect } from 'react';
// import api from '../../api/axios'; // Adjust path as needed

// const InvoiceDetailsModal = ({ invoiceId, onClose }) => {
//   const [invoice, setInvoice] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [downloadError, setDownloadError] = useState(''); // New state for download errors

//   useEffect(() => {
//     const fetchInvoiceDetails = async () => {
//       setLoading(true);
//       setError('');
//       setDownloadError(''); // Clear previous download errors
//       try {
//         const response = await api.get(`/invoices/${invoiceId}`);
//         setInvoice(response.data);
//       } catch (err) {
//         console.error('Error fetching invoice details:', err);
//         setError(err.response?.data?.message || 'Failed to load invoice details.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (invoiceId) {
//       fetchInvoiceDetails();
//     }
//   }, [invoiceId]);

//   const handleDownloadInvoice = () => {
//     setDownloadError(''); // Clear previous errors
//     if (!invoiceId) {
//       setDownloadError('No invoice ID available for download.');
//       return;
//     }

//     // Trigger the download by opening the backend endpoint in a new tab
//     // The backend should set Content-Disposition: attachment to force download
//     const downloadUrl = `${api.defaults.baseURL}/invoices/${invoiceId}/download`;
//     window.open(downloadUrl, '_blank'); // Opens in a new tab, triggering download
//   };

//   if (loading) return <p>Loading invoice details...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!invoice) return <p>No invoice selected or invoice not found.</p>;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Invoice Details (ID: {invoice.invoiceId})</h2>
//           <button
//             onClick={onClose}
//             className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
//           >
//             Close
//           </button>
//         </div>

//         {downloadError && <p className="text-red-500 mb-2">{downloadError}</p>}

//         <div className="space-y-2 text-gray-700">
//           <p><strong>Booking ID:</strong> {invoice.booking ? invoice.booking.id : 'N/A'}</p>
//           <p><strong>User Email:</strong> {invoice.userResponse ? invoice.userResponse.email : 'N/A'}</p>
//           <p><strong>Vehicle:</strong> {invoice.vehicleResponse ? `${invoice.vehicleResponse.make} ${invoice.vehicleResponse.model}` : 'N/A'}</p>
//           <p><strong>Service Type:</strong> {invoice.serviceType ? invoice.serviceType.description : 'N/A'}</p>
//           <p><strong>Total Amount:</strong> ${invoice.totalAmount ? invoice.totalAmount.toFixed(2) : '0.00'}</p>
//           <p><strong>Payment Status:</strong> <span className={`font-bold ${invoice.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'}`}>{invoice.paymentStatus}</span></p>
//           {invoice.generationDate && <p><strong>Generated On:</strong> {invoice.generationDate}</p>}
//         </div>

//         <div className="mt-6 flex justify-end space-x-3">
//           <button
//             onClick={handleDownloadInvoice}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Download Invoice
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceDetailsModal;
