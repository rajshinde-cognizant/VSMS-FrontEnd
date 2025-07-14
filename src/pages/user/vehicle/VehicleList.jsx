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
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

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
      <div className="mt-6">
        {vehicles.length === 0 ? (
          <p>No vehicles found. Please add a vehicle.</p>
        ) : (
          <table className="w-full rounded-lg shadow-lg rounded-lg border-collapse">
            <caption className="text-lg font-semibold mb-4">Your Vehicles</caption>
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2 text-left font-medium">Make</th>
                <th className="px-4 py-2 text-left font-medium">Model</th>
                <th className="px-4 py-2 text-left font-medium">Year</th>
                <th className="px-4 py-2 text-left font-medium">Plate</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, index) => (
                <tr
                  key={v.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition-colors`}
                >
                  <td className="px-4 py-2 text-gray-800">{v.make}</td>
                  <td className="px-4 py-2 text-gray-800">{v.model}</td>
                  <td className="px-4 py-2 text-gray-800">{v.regYear}</td>
                  <td className="px-4 py-2 text-gray-800">{v.registrationNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
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