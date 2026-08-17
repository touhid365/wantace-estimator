import React from 'react';

export default function QuestionStep({ question, value, onChange }) {
  if (!question) return null;

  const handleChange = (val) => {
    onChange(question.key, val);
  };

  const renderInput = () => {
    if (question.type === 'number') {
      return (
        <div className="space-y-2">
          <input
            type="number"
            id={question.key}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            min={question.min}
            max={question.max}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition"
            placeholder={`Enter value between ${question.min} and ${question.max}`}
          />
          {question.min && question.max && (
            <p className="text-sm text-gray-500">
              Enter a value between {question.min} and {question.max} {question.unit || ''}
            </p>
          )}
        </div>
      );
    }

    if (question.type === 'select') {
      return (
        <div className="space-y-3">
          {question.options?.map((option) => (
            <label
              key={option.value}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition ${
                value === option.value
                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name={question.key}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleChange(option.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">{option.label}</span>
              </div>
            </label>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {question.label}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h2>
        {question.unit && (
          <p className="text-sm text-gray-500 mt-1">Unit: {question.unit}</p>
        )}
      </div>

      {renderInput()}
    </div>
  );
}