const { customAlphabet } = require('nanoid');

// Example: 6-digit alphanumeric ID
const generateShippingId = () => {
  const randomPart = customAlphabet(alphabet, 6)();
  const timestamp = Date.now(); // milliseconds since epoch
  return `SHIP_${timestamp}_${randomPart}`;
};

const generateTrackingId = () => {
  const randomPart = customAlphabet(alphabet, 6)();
  const timestamp = Date.now();
  return `TRK_${timestamp}_${randomPart}`;
};

module.exports = {
  generateShippingId,
  generateTrackingId,
};
