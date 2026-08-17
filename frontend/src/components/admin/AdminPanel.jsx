import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfigEditor from './ConfigEditor';
import LeadList from './LeadList';
import { getConfig, getLeads, updateConfig } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('config');
  const [config, setConfig] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setMessage(null);
      
      console.log('📡 Loading admin data...');
      
      // Load config and leads in parallel
      const [configData, leadsData] = await Promise.all([
        getConfig(),
        getLeads()
      ]);
      
      console.log('✅ Config loaded:', configData);
      console.log('✅ Leads loaded:', leadsData);
      
      setConfig(configData);
      setLeads(leadsData.leads || []);
      
    } catch (err) {
      console.error('❌ Load data error:', err);
      
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setMessage({ type: 'error', text: 'Session expired. Please login again.' });
        setTimeout(() => {
          localStorage.removeItem('adminAuth');
          navigate('/admin/login');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: 'Failed to load data: ' + err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveConfig = async (updatedConfig) => {
    setSaving(true);
    setMessage(null);
    try {
      console.log('📡 Saving config...');
      const result = await updateConfig(updatedConfig);
      console.log('✅ Config saved:', result);
      
      setConfig(updatedConfig);
      setMessage({ 
        type: 'success', 
        text: `Configuration saved successfully! Version ${result.config_version || 'updated'}` 
      });
      
      // Reload to get updated config
      setTimeout(() => {
        loadData();
      }, 1000);
      
    } catch (err) {
      console.error('❌ Save error:', err);
      setMessage({ type: 'error', text: 'Failed to save: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Loading admin panel..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Owner Panel</h1>
            <p className="text-sm text-gray-500 mt-1">
              Version {config?.config_version || 1} 
              {config?.updatedAt && ` · Updated ${new Date(config.updatedAt).toLocaleDateString()}`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={loadData}
              className="text-sm text-blue-600 hover:text-blue-800 transition"
            >
              ↻ Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab('config')}
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition ${
                  activeTab === 'config'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ⚙️ Configuration
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition ${
                  activeTab === 'leads'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📋 Leads ({leads.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'config' && config && (
              <ConfigEditor
                config={config}
                onSave={handleSaveConfig}
                saving={saving}
              />
            )}
            {activeTab === 'leads' && (
              <LeadList leads={leads} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
