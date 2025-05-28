const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token provided." });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Failed to authenticate token." });

    req.user = {
      id: decoded.id,
      role: decoded.role,  // חשוב ששם התפקיד יהיה בטוקן
      // ...שדות נוספים אם יש
    };

    next();
  });
};

module.exports = verifyJWT;
// This middleware checks for a JWT in the request headers.