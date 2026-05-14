const validateStock = (req, res, next) => {
  const { stock } = req.body;

  if (stock === undefined) {
    return res.status(400).send({
      message: "Stock gerekli",
    });
  }

  if (typeof stock !== "number") {
    return res.status(400).send({
      message: "Stock sayı olmalı",
    });
  }

  if (stock < 0) {
    return res.status(400).send({
      message: "Stock negatif olamaz",
    });
  }

  next();
};

module.exports = validateStock;
