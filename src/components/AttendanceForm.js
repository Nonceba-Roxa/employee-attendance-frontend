import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const AttendanceForm = ({ onAttendanceAdded }) => {
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeID: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present"
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeName.trim() || !formData.employeeID.trim()) {
      setMessage("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API_BASE_URL}/attendance`, formData);
      setMessage(response.data.message || "Attendance recorded successfully");
      setFormData({
        employeeName: "",
        employeeID: "",
        date: new Date().toISOString().split("T")[0],
        status: "Present"
      });
      onAttendanceAdded?.();
    } catch (error) {
      console.error("Error submitting attendance:", error.response?.data || error.message);
      setMessage(error.response?.data?.error || "Failed to record attendance");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="attendance-form">
      <h2>GlowSkin's Employee Attendance</h2>
      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee Name *</label>
          <input type="text" name="employeeName" value={formData.employeeName} onChange={handleChange} required />
        </div>
        <div>
          <label>Employee ID *</label>
          <input type="text" name="employeeID" value={formData.employeeID} onChange={handleChange} required />
        </div>
        <div>
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div>
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} required>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
        <button type="submit" disabled={isLoading}>{isLoading ? "Recording..." : "Record Attendance"}</button>
      </form>
    </div>
  );
};

export default AttendanceForm;
