const express = require("express");

const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./src/swagger");

const http = require("http");

const { Server } = require("socket.io");

const { setIO } = require("./src/socket/socket");

const productsRoutes = require("./src/routes/productsRoutes");

const historyRoutes = require("./src/routes/historyRoutes");

const authRoutes = require("./src/routes/authRoutes");

require("./src/database/database");

const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",

    methods: ["GET", "POST"],
  },
});

const errorMiddleware = require("./src/middlewares/errorMiddleware");

setIO(io);

app.use(
  "/uploads",

  express.static("uploads"),
);

app.use(express.static("public"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);

app.use("/products", productsRoutes);

app.use("/history", historyRoutes);

app.use(errorMiddleware);

io.on("connection", (socket) => {
  console.log("Bir kullanıcı bağlandı");

  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı");
  });
});

app.get("/", (req, res) => {
  res.send("Depo sistemi çalışıyor");
});

const db = require("./src/database/database");

app.get("/make-admin", (req, res) => {
  db.run(
    `
        UPDATE users
        SET role = 'admin'
        WHERE username = 'admin'
        `,
    function (err) {
      if (err) {
        return res.send(err.message);
      }

      res.send("Admin yapıldı");
    },
  );
});
server.listen(3000, () => {
  console.log("Server çalışıyor");
});
