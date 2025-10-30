import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://employee-attendance-backend-cmu3.vercel.app/';

const AttendanceDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: '', employeeName: '', employeeID: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [attendance, filters]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/attendance`);
      console.log('✅ Attendance fetched:', res.data);
      setAttendance(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error('❌ Fetch failed:', err);
      setError('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let data = [...attendance];
    if (filters.date) data = data.filter(r => r.date?.startsWith(filters.date));
    if (filters.employeeName) data = data.filter(r => r.employeeName?.toLowerCase().includes(filters.employeeName.toLowerCase()));
    if (filters.employeeID) data = data.filter(r => r.employeeID?.toLowerCase().includes(filters.employeeID.toLowerCase()));
    setFiltered(data);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete record for ${name}?`)) return;
    console.log('🧩 Deleting ID:', id);

    try {
      const res = await axios.delete(`${API_BASE_URL}/attendance/${id}`);
      console.log('✅ Delete success:', res.data);

      if (res.data.success) {
        setAttendance(prev => prev.filter(r => r.id !== id && r.ID !== id));
        alert(`✅ Record for ${name} deleted.`);
      } else {
        alert(`⚠️ ${res.data.message || 'Delete failed'}`);
      }
    } catch (err) {
      console.error('❌ Delete failed:', err);
      alert('Error deleting record. Check console for details.');
    }
  };

  const clearFilters = () => setFilters({ date: '', employeeName: '', employeeID: '' });

  if (loading) return <p>Loading attendance...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="attendance-dashboard">
      <h2>GlowSkin's Attendance Records</h2>

      <div className="filters">
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={e => setFilters({ ...filters, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Employee Name"
          value={filters.employeeName}
          onChange={e => setFilters({ ...filters, employeeName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Employee ID"
          value={filters.employeeID}
          onChange={e => setFilters({ ...filters, employeeID: e.target.value })}
        />
        <button onClick={clearFilters}>Clear</button>
      </div>

      <p>Showing {filtered.length} of {attendance.length} records</p>

      <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '10px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee Name</th>
            <th>Employee ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan="6" align="center">No records found</td></tr>
          ) : (
            filtered.map(r => (
              <tr key={r.id || r.ID}>
                <td>{r.id || r.ID}</td>
                <td>{r.employeeName}</td>
                <td>{r.employeeID}</td>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>{r.status}</td>
                <td>
                  <button onClick={() => handleDelete(r.id || r.ID, r.employeeName)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceDashboard;
