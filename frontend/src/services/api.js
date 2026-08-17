// Make sure this points to the correct API endpoint
const API_URL = import.meta.env.VITE_API_URL || 'https://wantace-estimator-txka.onrender.com/api';

// Public endpoints - all should include /api prefix
export const getConfig = async () => {
  try {
    // ✅ Correct: /api/config
    const response = await fetch(`${API_URL}/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('getConfig error:', error);
    throw error;
  }
};

export const submitEstimate = async (data) => {
  try {
    // ✅ Correct: /api/estimate
    const response = await fetch(`${API_URL}/estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit estimate');
    }
    
    return response.json();
  } catch (error) {
    console.error('submitEstimate error:', error);
    throw error;
  }
};

export const getLeads = async () => {
  try {
    // ✅ Correct: /api/admin/leads
    const response = await fetch(`${API_URL}/admin/leads`, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch leads');
    }
    
    return response.json();
  } catch (error) {
    console.error('getLeads error:', error);
    throw error;
  }
};

export const updateConfig = async (config) => {
  try {
    // ✅ Correct: /api/admin/config
    const response = await fetch(`${API_URL}/admin/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
        'Accept': 'application/json'
      },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update configuration');
    }
    
    return response.json();
  } catch (error) {
    console.error('updateConfig error:', error);
    throw error;
  }
};

// Helper function for auth header
const getAuthHeader = () => {
  const credentials = btoa('admin:roofing2026!');
  return `Basic ${credentials}`;
};
