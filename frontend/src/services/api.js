const API_URL = import.meta.env.VITE_API_URL || 'https://wantace-estimator-txka.onrender.com/api';

// Helper to get auth header
const getAuthHeader = () => {
  const credentials = btoa('admin:roofing2026!');
  return `Basic ${credentials}`;
};

// Public endpoints
export const getConfig = async () => {
  try {
    console.log('📡 Fetching config from:', `${API_URL}/config`);
    const response = await fetch(`${API_URL}/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Config error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Config loaded successfully');
    return data;
  } catch (error) {
    console.error('❌ getConfig error:', error);
    throw error;
  }
};

export const submitEstimate = async (data) => {
  try {
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

// Admin endpoints (protected)
export const getLeads = async () => {
  try {
    console.log('📡 Fetching leads from:', `${API_URL}/admin/leads`);
    const response = await fetch(`${API_URL}/admin/leads`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - Please login again');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Leads loaded:', data);
    return data;
  } catch (error) {
    console.error('❌ getLeads error:', error);
    throw error;
  }
};

export const updateConfig = async (config) => {
  try {
    console.log('📡 Updating config...');
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
      if (response.status === 401) {
        throw new Error('Unauthorized - Please login again');
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to update configuration');
    }
    
    const data = await response.json();
    console.log('✅ Config updated:', data);
    return data;
  } catch (error) {
    console.error('❌ updateConfig error:', error);
    throw error;
  }
};
