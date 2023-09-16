const jwt = require("jsonwebtoken");
const config = require("../config");

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // extract token from Bearer string
  if (!token) return res.sendStatus(401);
  return jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err || !user.isAdmin) return res.sendStatus(403);
    req.user = user;
    return next();
  });
}

module.exports = requireAdmin;
