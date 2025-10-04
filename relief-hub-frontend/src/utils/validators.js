export const validateRegistration = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email address';
  }

  if (!data.phone || !/^\+63\d{10}$/.test(data.phone)) {
    errors.phone = 'Phone must be in format +639XXXXXXXXX';
  }

  if (!data.password || data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRequest = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name is required';
  }

  if (!data.phone || !/^\+63\d{10}$/.test(data.phone)) {
    errors.phone = 'Valid phone number is required';
  }

  if (!data.type) {
    errors.type = 'Please select request type';
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Please provide details (minimum 10 characters)';
  }

  if (!data.lat || !data.lng) {
    errors.location = 'Location is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateDonation = (amount) => {
  const errors = {};

  if (!amount || amount < 10) {
    errors.amount = 'Minimum donation is ₱10';
  }

  if (amount > 1000000) {
    errors.amount = 'Maximum donation is ₱1,000,000';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};