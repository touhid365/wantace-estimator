import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EstimatorFlow from './components/estimator/EstimatorFlow';
import AdminPanel from './components/admin/AdminPanel';
import AdminLogin from './components/admin/AdminLogin';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth') === 'true';
    setIsAuthenticated(auth);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EstimatorFlow />} />
        <Route path="/estimator" element={<EstimatorFlow />} />
        <Route 
          path="/admin" 
          element={
            isAuthenticated ? <AdminPanel /> : <Navigate to="/admin/login" />
          } 
        />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
