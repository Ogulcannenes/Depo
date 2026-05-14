const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({
      message: "Token gerekli",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "supersecretkey");

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).send({
      message: "Geçersiz token",
    });
  }
};

module.exports = authMiddleware;
