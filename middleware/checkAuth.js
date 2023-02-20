const jwt = require("jsonwebtoken");
function checkAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)  return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, tenant) => {
    if (err) return res.status(403).json({ message: err.message });
    const currentTime = Math.floor(Date.now() / 1000);
    if (tenant.exp < currentTime)
      return res.status(401).json({ message: "Token has expired" });
    req.tenant = tenant;
    next();
  });
}

module.exports = checkAuth;
