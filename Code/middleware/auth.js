const jwt = require('jwt-simple');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET || 'your_secret_key_here_change_in_production');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const generateToken = (userId) => {
  const payload = {
    userId: userId,
    iat: Math.floor(Date.now() / 1000)
  };
  return jwt.encode(payload, process.env.JWT_SECRET || 'your_secret_key_here_change_in_production');
};

module.exports = {
  verifyToken,
  generateToken
};
