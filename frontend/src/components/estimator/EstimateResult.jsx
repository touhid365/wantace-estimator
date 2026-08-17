import React from 'react';

export default function EstimateResult({ estimate, config, answers, contactInfo, onReset }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: config?.business?.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!estimate) return null;

  const { estimate_low, estimate_high, breakdown } = estimate;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Estimate</h2>
        <p className="text-gray-600 mt-1">
          Based on the information you provided
        </p>
      </div>

      {/* Estimate Range */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
        <div className="text-sm text-gray-600 mb-2">Estimated Cost Range</div>
        <div className="text-3xl font-bold text-blue-900">
          {formatCurrency(estimate_low)}
          <span className="text-xl text-gray-500 mx-2">—</span>
          {formatCurrency(estimate_high)}
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Includes materials, labor, and permit fees
        </div>
      </div>

      {/* Breakdown */}
      {breakdown && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-700 mb-3">Cost Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Material Cost</span>
              <span>{formatCurrency(breakdown.baseMaterialCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tear-off Cost</span>
              <span>{formatCurrency(breakdown.tearOffCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Permit Fee</span>
              <span>{formatCurrency(breakdown.permitFee)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(breakdown.subtotal + breakdown.permitFee)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-700 mb-2">Contact Information</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Name:</span> {contactInfo.name}</p>
          <p><span className="font-medium">Phone:</span> {contactInfo.phone}</p>
          <p><span className="font-medium">Email:</span> {contactInfo.email}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onReset}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Start Over
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Print Estimate
        </button>
      </div>
    </div>
  );
}