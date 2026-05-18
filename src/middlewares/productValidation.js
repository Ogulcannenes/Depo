const productValidation = (req, res, next) => {
  const { name, stock } = req.body;

  if (!name) {
    return res.status(400).send({
      message: "Ürün adı gerekli",
    });
  }

  if (stock === undefined) {
    return res.status(400).send({
      message: "Stock gerekli",
    });
  }

  next();
};

module.exports = productValidation;
