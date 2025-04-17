const { customAlphabet } = require('nanoid');

// Example: 6-digit alphanumeric ID
const generateUserId = () => `USR_${customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)()}`;
const generateShippingId = () => `SHIP_${customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)()}`;
const generateTrackingId = () => `TRK_${customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 8)()}`;

module.exports = {
  generateUserId,
  generateShippingId,
  generateTrackingId,
};
