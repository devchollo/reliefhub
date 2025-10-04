// utils/validators.js
// Input validation helpers to prevent XSS and injection

exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potential XSS patterns
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
};

exports.validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

exports.validatePhone = (phone) => {
  // Philippine phone format: +639XXXXXXXXX
  const re = /^\+63\d{10}$/;
  return re.test(phone);
};

exports.validateCoordinates = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  return (
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};