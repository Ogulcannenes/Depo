const errorMiddleware = (err, req, res, next) => {
  console.log(err);

  res.status(err.status || 500).send({
    message: err.message || "Server hatası",
  });
};

module.exports = errorMiddleware;
