import React, { useState } from 'react';
import QuestionStep from './QuestionStep';
import ContactStep from './ContactStep';
import EstimateResult from './EstimateResult';
import LoadingSpinner from '../common/LoadingSpinner';
import { useEstimator } from '../../hooks/useEstimator';

export default function EstimatorFlow() {
  const {
    config,
    loading,
    error,
    currentStep,
    answers,
    contactInfo,
    estimate,
    isSubmitting,
    setAnswer,
    setContactInfo,
    nextStep,
    prevStep,
    submitEstimate,
    resetEstimator
  } = useEstimator();

  const [validationError, setValidationError] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Loading estimator..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-red-600 text-xl font-semibold mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!config) {
    return null;
  }

  const activeQuestions = config.questions?.filter(q => q.active) || [];

  const handleNext = () => {
    setValidationError(null);
    
    if (currentStep < activeQuestions.length) {
      const question = activeQuestions[currentStep];
      const value = answers[question.key];
      
      if (question.required && (value === undefined || value === '' || value === null)) {
        setValidationError('Please answer this question before continuing.');
        return;
      }
      
      if (question.type === 'number') {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          setValidationError('Please enter a valid number.');
          return;
        }
        if (question.min !== undefined && numValue < question.min) {
          setValidationError(`Value must be at least ${question.min}`);
          return;
        }
        if (question.max !== undefined && numValue > question.max) {
          setValidationError(`Value must be at most ${question.max}`);
          return;
        }
      }
    }
    
    nextStep();
  };

  const renderStep = () => {
    if (currentStep < activeQuestions.length) {
      return (
        <QuestionStep
          question={activeQuestions[currentStep]}
          value={answers[activeQuestions[currentStep].key]}
          onChange={setAnswer}
        />
      );
    } else if (currentStep === activeQuestions.length) {
      return (
        <ContactStep
          contactInfo={contactInfo}
          onChange={setContactInfo}
          onSubmit={submitEstimate}
          isSubmitting={isSubmitting}
        />
      );
    } else {
      return (
        <EstimateResult
          estimate={estimate}
          config={config}
          answers={answers}
          contactInfo={contactInfo}
          onReset={resetEstimator}
        />
      );
    }
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep > activeQuestions.length;
  const isContactStep = currentStep === activeQuestions.length;

  const totalSteps = activeQuestions.length + 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {config.business?.name || 'Roofing Estimator'}
          </h1>
          <p className="text-gray-600 mt-2">
            Get a free, no-obligation estimate for your roof replacement
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {Math.min(currentStep + 1, totalSteps)} of {totalSteps}</span>
            <span>{Math.round(Math.min((currentStep + 1) / totalSteps * 100, 100))}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((currentStep + 1) / totalSteps * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            {validationError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                ⚠️ {validationError}
              </div>
            )}
            {renderStep()}
            {!isLastStep && (
              <div className="mt-8 flex justify-between items-center border-t pt-6">
                <button
                  onClick={prevStep}
                  disabled={isFirstStep}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    isFirstStep
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ← Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isContactStep ? (
                    isSubmitting ? 'Submitting...' : 'Get My Estimate →'
                  ) : (
                    'Next →'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}