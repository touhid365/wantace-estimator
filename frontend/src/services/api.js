const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth header
const getAuthHeader = () => {
  const credentials = btoa('admin:roofing2026!');
  return `Basic ${credentials}`;
};

// Public endpoints
export const getConfig = async () => {
  const response = await fetch(`${API_URL}/config`);
  if (!response.ok) {
    throw new Error('Failed to fetch configuration');
  }
  return response.json();
};

export const submitEstimate = async (data) => {
  const response = await fetch(`${API_URL}/estimate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit estimate');
  }
  
  return response.json();
};

// Admin endpoints (protected)
export const getLeads = async () => {
  const response = await fetch(`${API_URL}/admin/leads`, {
    headers: {
      'Authorization': getAuthHeader(),
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch leads');
  }
  
  return response.json();
};

export const updateConfig = async (config) => {
  const response = await fetch(`${API_URL}/admin/config`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthHeader(),
    },
    body: JSON.stringify(config),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update configuration');
  }
  
  return response.json();
};