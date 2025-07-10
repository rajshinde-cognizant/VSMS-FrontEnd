// src/pages/user/vehicle/VehicleList.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../../../api/axios';
import { AuthContext } from '../../../context/AuthContext';
import ConfirmationModal from '../../common/ConfirmationModal';

const VehicleList = ({ refreshTrigger }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const currentUserEmail = user?.id; // Get user email from AuthContext

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  //const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const fetchVehicles = async () => {
    setLoading(true);
    setError('');

    if (authLoading) {
      return; // Wait for auth context to load
    }
    if (!user || !currentUserEmail) {
      setError('User not logged in or email not available. Please log in to view your vehicles.');
      setLoading(false);
      return;
    }

    try {
      // CORRECTED ENDPOINT: Use /api/vehicles/getAll?email={currentUserEmail}
      const res = await api.get(`/vehicles/getAll?email=${currentUserEmail}`);
      setVehicles(res.data); // Backend is now responsible for filtering
    } catch (err) {
      console.error('Failed to fetch vehicles', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication required to view your vehicles. Please log in.');
      } else if (err.response && err.response.status === 403) {
        setError('Permission denied to view vehicles. Ensure your user account has access.');
      } else {
        setError(err.response?.data?.message || 'Failed to load vehicles.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && currentUserEmail) {
      fetchVehicles();
      console.log(vehicles);
    }
  }, [authLoading, currentUserEmail, refreshTrigger]); // Depend on authLoading, currentUserEmail, and refreshTrigger

  // const handleDeleteClick = (id) => {
  //   setVehicleToDelete(id);
  //   setShowConfirmModal(true);
  // };

  const handleConfirmDelete = async () => {
    setShowConfirmModal(false);
    if (!vehicleToDelete) return;

    try {
      await api.delete(`/vehicles/${vehicleToDelete}`);
      // After deletion, re-fetch the list to reflect changes
      fetchVehicles();
      setError('');
    } catch (err) {
      console.error('Failed to delete vehicle', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication required to delete vehicle. Please log in.');
      } else {
        setError(err.response?.data?.message || 'Failed to delete vehicle.');
      }
    } finally {
      setVehicleToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setVehicleToDelete(null);
  };

  if (loading) return <p>Loading your vehicles...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <div className="mt-6 space-y-4">
        {vehicles.length === 0 ? (
          <p>No vehicles found. Please add a vehicle.</p>
        ) : (
          vehicles.map((v) => (
            <div key={v.id} className="border p-4 rounded shadow flex justify-between items-center">
              <div>
                {/* <p><strong>ID: {v.id}</strong></p> */}
                <p><strong>{v.make} {v.model}</strong> ({v.regYear})</p>
                <p>Plate: {v.registrationNumber}</p>
              </div>
              {/* <div className="space-x-2">
                <button
                  onClick={() => handleDeleteClick(v.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div> */}
            </div>
          ))
        )}
      </div>

      {showConfirmModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this vehicle?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default VehicleList;





// // src/pages/user/vehicle/VehicleList.jsx
// import React, { useEffect, useState, useContext } from 'react';
// import api from '../../../api/axios';
// import { AuthContext } from '../../../context/AuthContext'; // Import AuthContext
// import ConfirmationModal from '../../../pages/common/ConfirmationModal'; // Import ConfirmationModal

// const VehicleList = ({ refreshTrigger }) => { // Accepts refreshTrigger prop
//   const { user, loading: authLoading } = useContext(AuthContext); // Get user and authLoading from AuthContext

//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true); // Added loading state
//   const [error, setError] = useState('');     // Added error state
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [vehicleToDelete, setVehicleToDelete] = useState(null);

//   const fetchVehicles = async () => {
//     setLoading(true);
//     setError('');
//     // If auth is still loading, wait for it.
//     // If user is null (not logged in), set error and stop.
//     if (authLoading) {
//       return; // Wait for auth context to load
//     }
//     if (!user) {
//       setError('User not logged in. Please log in to view your vehicles.');
//       setLoading(false);
//       return;
//     }

//     try {
//       // CORRECTED ENDPOINT: Fetch all vehicles for the logged-in user.
//       // The backend's @GetMapping("/api/vehicles") uses the email from the JWT for filtering.
//       const res = await api.get('/vehicles');
//       setVehicles(res.data);
//     } catch (err) {
//       console.error('Failed to fetch vehicles', err);
//       if (err.response && err.response.status === 401) {
//         setError('Authentication required to view your vehicles. Please log in.');
//       } else if (err.response && err.response.status === 403) {
//         setError('Permission denied to view vehicles. Ensure your user account has access.');
//       } else {
//         setError(err.response?.data?.message || 'Failed to load vehicles.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Fetch vehicles when auth state changes (user logs in/out) or refreshTrigger changes
//     // Only attempt to fetch if auth is not loading and user state is resolved
//     if (!authLoading) {
//       fetchVehicles();
//     }
//   }, [authLoading, refreshTrigger]); // Depend on authLoading and refreshTrigger

//   const handleDeleteClick = (id) => {
//     setVehicleToDelete(id);
//     setShowConfirmModal(true);
//   };

//   const handleConfirmDelete = async () => {
//     setShowConfirmModal(false);
//     if (!vehicleToDelete) return;

//     try {
//       await api.delete(`/vehicles/${vehicleToDelete}`);
//       setVehicles(vehicles.filter(v => v.id !== vehicleToDelete)); // Optimistic update
//       setError(''); // Clear any previous error
//     } catch (err) {
//       console.error('Failed to delete vehicle', err);
//       if (err.response && err.response.status === 401) {
//         setError('Authentication required to delete vehicle. Please log in.');
//       } else {
//         setError(err.response?.data?.message || 'Failed to delete vehicle.');
//       }
//     } finally {
//       setVehicleToDelete(null);
//     }
//   };

//   const handleCancelDelete = () => {
//     setShowConfirmModal(false);
//     setVehicleToDelete(null);
//   };

//   if (loading) return <p>Loading your vehicles...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="p-4">
//       <div className="mt-6 space-y-4">
//         {vehicles.length === 0 ? (
//           <p>No vehicles found. Please add a vehicle.</p>
//         ) : (
//           vehicles.map((v) => (
//             <div key={v.id} className="border p-4 rounded shadow flex justify-between items-center">
//               <div>
//                 <p><strong>ID: {v.id}</strong></p>
//                 <p><strong>{v.make} {v.model}</strong> ({v.regYear})</p>
//                 <p>Plate: {v.registrationNumber}</p>
//               </div>
//               <div className="space-x-2">
//                 <button
//                   onClick={() => handleDeleteClick(v.id)}
//                   className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {showConfirmModal && (
//         <ConfirmationModal
//           message="Are you sure you want to delete this vehicle?"
//           onConfirm={handleConfirmDelete}
//           onCancel={handleCancelDelete}
//         />
//       )}
//     </div>
//   );
// };

// export default VehicleList;
