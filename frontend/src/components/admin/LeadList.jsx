import React, { useState } from 'react';

export default function LeadList({ leads }) {
  const [expandedLead, setExpandedLead] = useState(null);

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-lg font-medium text-gray-900">No leads yet</h3>
        <p className="text-gray-500 mt-1">When homeowners submit estimates, they'll appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          Showing {leads.length} lead{leads.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-3">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition"
          >
            <div
              className="p-4 cursor-pointer flex items-center justify-between"
              onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div>
                  <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                  <div className="text-xs text-gray-500">{lead.email}</div>
                </div>
                <div className="text-sm text-gray-600">{lead.phone}</div>
                <div className="text-sm font-medium text-blue-600">
                  {formatCurrency(lead.estimate_low)} — {formatCurrency(lead.estimate_high)}
                </div>
                <div className="text-xs text-gray-400">
                  {formatDate(lead.captured_at)}
                </div>
              </div>
              <span className="ml-4 text-gray-400">
                {expandedLead === lead.id ? '▼' : '▶'}
              </span>
            </div>

            {expandedLead === lead.id && (
              <div className="border-t border-gray-100 bg-gray-50 p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-600">Version:</span>
                    <span className="text-gray-700">{lead.config_version}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-600 text-sm mb-1">Answers:</div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      {Object.entries(lead.answers).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1 text-sm border-b last:border-b-0 border-gray-100">
                          <span className="text-gray-600">{key}:</span>
                          <span className="text-gray-900 font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}