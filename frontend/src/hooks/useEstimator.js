import { useState, useEffect } from 'react';
import { getConfig, submitEstimate as apiSubmitEstimate } from '../services/api';

export function useEstimator() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contactInfo, setContactInfo] = useState({ 
    name: '', 
    phone: '', 
    email: '' 
  });
  const [estimate, setEstimate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load config on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const data = await getConfig();
        setConfig(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load configuration');
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  const setAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const submitEstimate = async () => {
    // Validate contact info
    if (!contactInfo.name || !contactInfo.phone || !contactInfo.email) {
      setError('Please fill in all contact information');
      return;
    }

    // Validate phone format
    if (!/^[\+\d\s\-\(\)]{10,}$/.test(contactInfo.phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await apiSubmitEstimate({
        ...contactInfo,
        answers
      });
      setEstimate(result);
      nextStep();
      return result;
    } catch (err) {
      setError(err.message || 'Failed to submit estimate');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetEstimator = () => {
    setCurrentStep(0);
    setAnswers({});
    setContactInfo({ name: '', phone: '', email: '' });
    setEstimate(null);
  };

  return {
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
  };
}