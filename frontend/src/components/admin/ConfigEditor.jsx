import React, { useState } from 'react';

export default function ConfigEditor({ config, onSave, saving }) {
  const [editableConfig, setEditableConfig] = useState(JSON.parse(JSON.stringify(config)));

  const handleQuestionChange = (index, field, value) => {
    const updated = { ...editableConfig };
    updated.questions[index] = { ...updated.questions[index], [field]: value };
    setEditableConfig(updated);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updated = { ...editableConfig };
    const parsedValue = typeof value === 'string' && !isNaN(value) ? parseFloat(value) : value;
    updated.questions[qIndex].options[oIndex] = {
      ...updated.questions[qIndex].options[oIndex],
      [field]: parsedValue
    };
    setEditableConfig(updated);
  };

  const handleModifierChange = (key, value) => {
    const updated = { ...editableConfig };
    updated.modifiers[key] = parseFloat(value);
    setEditableConfig(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editableConfig);
  };

  const getOptionFields = (question, qIndex) => {
    const fields = [];
    
    if (question.key === 'material') {
      fields.push({ key: 'rate_per_sqft', label: 'Rate ($/sqft)', type: 'number', step: '0.01' });
    } else if (question.key === 'pitch' || question.key === 'stories') {
      fields.push({ key: 'multiplier', label: 'Multiplier', type: 'number', step: '0.01' });
    } else if (question.key === 'layers') {
      fields.push({ key: 'tear_off_per_sqft', label: 'Tear-off ($/sqft)', type: 'number', step: '0.01' });
    }
    
    return fields;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Modifiers */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Global Modifiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waste Factor (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={((editableConfig.modifiers?.waste_factor || 0.10) * 100).toFixed(1)}
              onChange={(e) => handleModifierChange('waste_factor', e.target.value / 100)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Permit Fee ($)
            </label>
            <input
              type="number"
              value={editableConfig.modifiers?.permit_flat_fee || 350}
              onChange={(e) => handleModifierChange('permit_flat_fee', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Range Spread (%)
            </label>
            <input
              type="number"
              step="1"
              value={editableConfig.modifiers?.range_spread_pct || 12}
              onChange={(e) => handleModifierChange('range_spread_pct', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Questions</h3>
        <div className="space-y-6">
          {editableConfig.questions?.map((question, qIndex) => (
            <div key={question.key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-gray-500">{question.key}</span>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={question.active}
                      onChange={(e) => handleQuestionChange(qIndex, 'active', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    Active
                  </label>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {question.type}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Label</label>
                  <input
                    type="text"
                    value={question.label}
                    onChange={(e) => handleQuestionChange(qIndex, 'label', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {question.type === 'number' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Min</label>
                      <input
                        type="number"
                        value={question.min || ''}
                        onChange={(e) => handleQuestionChange(qIndex, 'min', parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Max</label>
                      <input
                        type="number"
                        value={question.max || ''}
                        onChange={(e) => handleQuestionChange(qIndex, 'max', parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {question.type === 'select' && question.options && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Options</label>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => {
                        const fields = getOptionFields(question, qIndex);
                        return (
                          <div key={option.value} className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <input
                              type="text"
                              value={option.label}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, 'label', e.target.value)}
                              className="flex-1 min-w-[150px] p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="Label"
                            />
                            {fields.map(field => (
                              <input
                                key={field.key}
                                type={field.type}
                                step={field.step}
                                value={option[field.key] || ''}
                                onChange={(e) => handleOptionChange(qIndex, oIndex, field.key, e.target.value)}
                                className="w-32 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder={field.label}
                              />
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end border-t pt-6">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : '💾 Save Changes'}
        </button>
      </div>
    </form>
  );
}