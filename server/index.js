const express = require("express");

const PORT = process.env.PORT || 4000;

const app = express();
var cors = require("cors");

app.use(cors());

app.get("/api", (req, res) => {
  res.json({ message: "Hello from the server!!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
