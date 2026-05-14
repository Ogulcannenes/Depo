const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({
      message: "Bu işlem için admin olmalısın",
    });
  }

  next();
};

module.exports = adminMiddleware;
