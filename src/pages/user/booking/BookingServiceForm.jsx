// // src/pages/user/booking/BookingServiceForm.jsx
// import React, { useState, useContext, useEffect } from 'react';
// import api from '../../../api/axios';
// import { AuthContext } from '../../../context/AuthContext';

// const BookingServiceForm = ({ onBookingCreated }) => {
//   const { user, loading: authLoading } = useContext(AuthContext);
//   const currentUserEmail = user?.id; // Get user email from AuthContext

//   const [vehicleId, setVehicleId] = useState('');
//   const [serviceCenterId, setServiceCenterId] = useState('');
//   const [bookingDate, setBookingDate] = useState('');
//   const [status, setStatus] = useState('PENDING'); // Default status
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const [vehicles, setVehicles] = useState([]);
//   const [serviceCenters, setServiceCenters] = useState([]);
//   const [loadingDependencies, setLoadingDependencies] = useState(true);

//   useEffect(() => {
//     const fetchDependencies = async () => {
//       setLoadingDependencies(true);
//       setError('');

//       if (authLoading) {
//         return;
//       }
//       if (!user || !currentUserEmail) {
//         setError('User not logged in or user email not available. Cannot load booking options.');
//         setLoadingDependencies(false);
//         return;
//       }

//       try {
//         // CORRECTED ENDPOINT: Fetch vehicles for the current user by email
//         const vehiclesResponse = await api.get(`/vehicles/getAll?email=${currentUserEmail}`);
//         setVehicles(vehiclesResponse.data); // Backend is now responsible for filtering

//         // Fetch all service centers
//         const serviceCentersResponse = await api.get('/service-centers');
//         setServiceCenters(serviceCentersResponse.data);
//       } catch (err) {
//         console.error('Error fetching booking dependencies:', err);
//         if (err.response && err.response.status === 401) {
//           setError('Authentication required to load booking options. Please log in.');
//         } else if (err.response && err.response.status === 403) {
//           setError('Permission denied to fetch resources. Ensure your user account has access.');
//         } else {
//           setError(err.response?.data?.message || 'Failed to load vehicles or service centers.');
//         }
//       } finally {
//         setLoadingDependencies(false);
//       }
//     };

//     if (!authLoading) {
//       fetchDependencies();
//     }
//   }, [authLoading, user, currentUserEmail]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!currentUserEmail) {
//       setError('User email not available. Cannot create booking.');
//       return;
//     }

//     try {
//       const payload = {
//         userEmail: currentUserEmail,
//         vehicleId: parseInt(vehicleId),
//         serviceCenterId: parseInt(serviceCenterId),
//         bookingDate,
//         status,
//       };
//       const response = await api.post('/bookings', payload);
//       setSuccess(`Booking created successfully with ID: ${response.data.id}`);
//       setVehicleId('');
//       setServiceCenterId('');
//       setBookingDate('');
//       setStatus('PENDING');
//       onBookingCreated();
//     } catch (err) {
//       console.error('Error creating booking:', err);
//       if (err.response && err.response.status === 401) {
//         setError('Authentication required. Please log in.');
//       } else if (err.response && err.response.status === 403) {
//         setError('Permission denied to create booking. Ensure your user account has the necessary role.');
//       } else {
//         setError(err.response?.data?.message || 'Failed to create booking. Please check your input.');
//       }
//     }
//   };

//   if (loadingDependencies) return <p>Loading options for booking...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//       <h2 className="text-xl font-semibold mb-4">Book a Service</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {error && <p className="text-red-500">{error}</p>}
//         {success && <p className="text-green-500">{success}</p>}

//         <div>
//           <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">Select Vehicle</label>
//           <select
//             id="vehicleId"
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//             value={vehicleId}
//             onChange={(e) => setVehicleId(e.target.value)}
//             required
//           >
//             <option value="">-- Select your vehicle --</option>
//             {vehicles.map(v => (
//               <option key={v.id} value={v.id}>{v.make} {v.model} ({v.registrationNumber})</option>
//             ))}
//           </select>
//           {vehicles.length === 0 && <p className="text-sm text-red-500 mt-1">No vehicles found. Please add a vehicle first.</p>}
//         </div>
//         <div>
//           <label htmlFor="serviceCenterId" className="block text-sm font-medium text-gray-700">Select Service Center</label>
//           <select
//             id="serviceCenterId"
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//             value={serviceCenterId}
//             onChange={(e) => setServiceCenterId(e.target.value)}
//             required
//           >
//             <option value="">-- Select a service center --</option>
//             {serviceCenters.map(sc => (
//               <option key={sc.id} value={sc.id}>{sc.name} ({sc.location})</option>
//             ))}
//           </select>
//           {serviceCenters.length === 0 && <p className="text-sm text-red-500 mt-1">No service centers available.</p>}
//         </div>
//         <div>
//           <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">Preferred Date</label>
//           <input
//             type="date"
//             id="bookingDate"
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//             value={bookingDate}
//             onChange={(e) => setBookingDate(e.target.value)}
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           Submit Booking
//         </button>
//       </form>
//     </div>
//   );
// };

// export default BookingServiceForm;

// src/pages/user/booking/BookingServiceForm.jsx
import React, { useState, useContext, useEffect } from 'react';
import api from '../../../api/axios';
import { AuthContext } from '../../../context/AuthContext';

const BookingServiceForm = ({ onBookingCreated }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const currentUserEmail = user?.id; // Get user email from AuthContext

  const [vehicleId, setVehicleId] = useState('');
  const [serviceCenterId, setServiceCenterId] = useState('');
  const [serviceTypeId, setServiceTypeId] = useState(''); // New state for selected service type
  const [bookingDate, setBookingDate] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [vehicles, setVehicles] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [availableServiceTypes, setAvailableServiceTypes] = useState([]); // State for service types based on selected center
  const [loadingDependencies, setLoadingDependencies] = useState(true);

  // Effect to fetch initial dependencies (vehicles, all service centers)
  useEffect(() => {
    const fetchInitialDependencies = async () => {
      setLoadingDependencies(true);
      setError('');

      if (authLoading) return;
      if (!user || !currentUserEmail) {
        setError('User not logged in or user email not available. Cannot load booking options.');
        setLoadingDependencies(false);
        return;
      }

      try {
        const vehiclesResponse = await api.get(`/vehicles/getAll?email=${currentUserEmail}`);
        setVehicles(vehiclesResponse.data);

        const serviceCentersResponse = await api.get('/service-centers');
        setServiceCenters(serviceCentersResponse.data);
      } catch (err) {
        console.error('Error fetching initial booking dependencies:', err);
        setError(err.response?.data?.message || 'Failed to load initial data.');
      } finally {
        setLoadingDependencies(false);
      }
    };

    if (!authLoading) {
      fetchInitialDependencies();
    }
  }, [authLoading, user, currentUserEmail]);

  // Effect to fetch service types when serviceCenterId changes
  useEffect(() => {
    const fetchServiceTypesForCenter = async () => {
      if (serviceCenterId) {
        try {
          // Call the new backend endpoint
          const response = await api.get(`/service-centers/${serviceCenterId}/service-types`);
          setAvailableServiceTypes(response.data);
          setServiceTypeId(''); // Reset selected service type when center changes
        } catch (err) {
          console.error('Error fetching service types for center:', err);
          setError(err.response?.data?.message || 'Failed to load service types for selected center.');
          setAvailableServiceTypes([]); // Clear service types on error
        }
      } else {
        setAvailableServiceTypes([]); // Clear if no service center is selected
        setServiceTypeId('');
      }
    };

    fetchServiceTypesForCenter();
  }, [serviceCenterId]); // Re-run when serviceCenterId changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentUserEmail) {
      setError('User email not available. Cannot create booking.');
      return;
    }
    if (!serviceTypeId) { // Ensure a service type is selected
        setError('Please select a service type.');
        return;
    }

    try {
      const payload = {
        userEmail: currentUserEmail,
        vehicleId: parseInt(vehicleId),
        serviceCenterId: parseInt(serviceCenterId),
        serviceTypeId: parseInt(serviceTypeId), // Include the selected serviceTypeId
        bookingDate,
        status,
      };
      const response = await api.post('/bookings', payload);
      setSuccess(`Booking created successfully with ID: ${response.data.id}`);
      // Reset form fields
      setVehicleId('');
      setServiceCenterId('');
      setServiceTypeId('');
      setBookingDate('');
      setStatus('PENDING');
      onBookingCreated();
    } catch (err) {
      console.error('Error creating booking:', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication required. Please log in.');
      } else if (err.response && err.response.status === 403) {
        setError('Permission denied to create booking. Ensure your user account has the necessary role.');
      } else {
        setError(err.response?.data?.message || 'Failed to create booking. Please check your input.');
      }
    }
  };

  if (loadingDependencies) return <p>Loading options for booking...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Book a Service</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <div>
          <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">Select Vehicle</label>
          <select
            id="vehicleId"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            required
          >
            <option value="">-- Select your vehicle --</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.make} {v.model} ({v.registrationNumber})</option>
            ))}
          </select>
          {vehicles.length === 0 && <p className="text-sm text-red-500 mt-1">No vehicles found. Please add a vehicle first.</p>}
        </div>

        <div>
          <label htmlFor="serviceCenterId" className="block text-sm font-medium text-gray-700">Select Service Center</label>
          <select
            id="serviceCenterId"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={serviceCenterId}
            onChange={(e) => setServiceCenterId(e.target.value)}
            required
          >
            <option value="">-- Select a service center --</option>
            {serviceCenters.map(sc => (
              <option key={sc.id} value={sc.id}>{sc.name} ({sc.location})</option>
            ))}
          </select>
          {serviceCenters.length === 0 && <p className="text-sm text-red-500 mt-1">No service centers available.</p>}
        </div>

        {/* New Service Type Dropdown - appears only if a service center is selected */}
        {serviceCenterId && (
          <div>
            <label htmlFor="serviceTypeId" className="block text-sm font-medium text-gray-700">Select Service Type</label>
            <select
              id="serviceTypeId"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={serviceTypeId}
              onChange={(e) => setServiceTypeId(e.target.value)}
              required
            >
              <option value="">-- Select a service type --</option>
              {availableServiceTypes.length === 0 ? (
                <option value="" disabled>No service types available for this center.</option>
              ) : (
                availableServiceTypes.map(st => (
                  <option key={st.id} value={st.id}>{st.name} (Price: ${st.price})</option>
                ))
              )}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">Preferred Date</label>
          <input
            type="date"
            id="bookingDate"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit Booking
        </button>
      </form>
    </div>
  );
};

export default BookingServiceForm;
