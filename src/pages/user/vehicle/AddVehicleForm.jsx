import { useState } from 'react';
import api from '../../../api/axios';

const AddVehicleForm = ({ onAdd }) => {
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    regYear: '',
    registrationNumber: ''
  });
  const [message, setMessage] = useState(''); // State for messages (success/error)
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setMessageType('');
    try {
      await api.post('/vehicles', vehicle);
      setMessage("Vehicle added successfully!");
      setMessageType('success');
      setVehicle({ make: '', model: '', regYear: '', registrationNumber: '' });
      onAdd(); // refresh list
    } catch (err) {
      console.error("Add failed", err);
      setMessage("Failed to add vehicle: " + (err.response?.data?.message || err.message));
      setMessageType('error');
    }
  };

  return (
    <div className="bg-white p-6">
      <h3 className="text-lg font-semibold mb-3">Add New Vehicle</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <p className={`mb-3 text-sm ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700">Make</label>
            <input name="make" id="make" value={vehicle.make} onChange={handleChange} required placeholder="e.g., Toyota" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
            <input name="model" id="model" value={vehicle.model} onChange={handleChange} required placeholder="e.g., Camry" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="regYear" className="block text-sm font-medium text-gray-700">Registration Year</label>
            <input name="regYear" id="regYear" value={vehicle.regYear} onChange={handleChange} required placeholder="e.g., 2020" type="number" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">License Plate No.</label>
            <input name="registrationNumber" id="registrationNumber" value={vehicle.registrationNumber} onChange={handleChange} required placeholder="e.g., ABC 1234" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Vehicle
        </button>
      </form>
    </div>
  );
};

export default AddVehicleForm;
