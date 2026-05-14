const { createUser, loginUser } = require("../services/authService");

const register = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Body gerekli",
    });
  }

  const { username, password } = req.body;

  createUser(username, password, (err, result) => {
    if (err) {
      return res.status(err.status || 500).send({
        message: err.message || "Server hatası",
      });
    }

    res.send(result);
  });
};

const login = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Body gerekli",
    });
  }

  const { username, password } = req.body;

  loginUser(username, password, (err, result) => {
    if (err) {
      return res.status(err.status || 500).send({
        message: err.message || "Server hatası",
      });
    }

    res.send(result);
  });
};

module.exports = {
  register,
  login,
};
