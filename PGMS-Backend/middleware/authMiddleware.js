// authMiddleware.js

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    token = token.split(" ")[1];
    let decodedToken = jwt.verify(token, SECRET_KEY);
    req.data = decodedToken; 
    next(); 
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
