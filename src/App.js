import React, { useState } from 'react';
import AttendanceForm from './components/AttendanceForm';
import AttendanceDashboard from './components/AttendanceDashboard';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('form');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAttendanceAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Employee Attendance Tracker</h1>
        <nav className="nav-tabs">
          <button 
            className={currentPage === 'form' ? 'active' : ''}
            onClick={() => setCurrentPage('form')}
          >
            Mark Attendance
          </button>
          <button 
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentPage('dashboard')}
          >
            View Records
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentPage === 'form' ? (
          <AttendanceForm onAttendanceAdded={handleAttendanceAdded} />
        ) : (
          <AttendanceDashboard key={refreshKey} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;