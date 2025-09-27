const express = require("express");
const jwt = require("jsonwebtoken");
const usersRouter = require("./routes/users");

const app = express();
const port = 3000;

app.use(express.json());


function auth(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).send({ error: "Missing token" });

  const token = header.split(" ")[1];
  jwt.verify(token, "supersecret", (err, decoded) => {
    if (err) return res.status(401).send({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

app.set("auth", auth);


app.get("/", (req, res) => {
  res.send({ message: "Welcome to the API" });
});

app.use("/auth", usersRouter);


app.use((err, req, res, next) => {
  console.error("🚀 ~ error:", err);

  if (err.status) {
    return res.status(err.status).send({ error: err.message });
  }

  res.status(400).send({ error: "Something went wrong" });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = { app, auth };