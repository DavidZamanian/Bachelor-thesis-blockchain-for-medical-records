//const express = require("express");
//var cors = require("cors");
import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());

app.get("/api", (req, res) => {
  res.json({ message: "Hello from the server!!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
