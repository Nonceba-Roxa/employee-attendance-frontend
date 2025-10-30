import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://employee-attendance-backend-cmu3.vercel.app';

const AttendanceForm = ({ onAttendanceAdded }) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeID: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.employeeName.trim() || !formData.employeeID.trim()) {
      setMessage('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      console.log('📝 Submitting to:', `${API_BASE_URL}/api/attendance`);
      console.log('📦 Data:', formData);
      
      const response = await axios.post(`${API_BASE_URL}/api/attendance`, formData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Submit success:', response.data);
      setMessage(response.data.message);
      setFormData({
        employeeName: '',
        employeeID: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });
      onAttendanceAdded();
      
    } catch (error) {
      console.error('❌ Submit failed:', error);
      
      let errorMessage = 'Failed to record attendance';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - server may be down';
      } else if (error.response) {
        errorMessage = error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check if backend is running.';
      } else {
        errorMessage = `Unexpected error: ${error.message}`;
      }
      
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="attendance-form">
      <h2>GlowSkin's Employee Attendance</h2>
      
      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="employeeName">Employee Name *</label>
          <input
            type="text"
            id="employeeName"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            required
            placeholder="Enter employee name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="employeeID">Employee ID *</label>
          <input
            type="text"
            id="employeeID"
            name="employeeID"
            value={formData.employeeID}
            onChange={handleChange}
            required
            placeholder="Enter employee ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Attendance Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Recording...' : 'Record Attendance'}
        </button>
      </form>
    </div>
  );
};

export default AttendanceForm;