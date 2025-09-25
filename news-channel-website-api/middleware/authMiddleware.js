// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token gerekli' });
  }

  try {
    const decoded = jwt.verify(token, 'secretKey');
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token süresi dolmuş' });
    }
    return res.status(403).json({ message: 'Geçersiz token' });
  }
};

module.exports = authenticate;
