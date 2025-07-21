// dotenv
// this library helps to read the .env file making the key value peer avaliable to the process.env of node
require("dotenv").config();
const express = require("express");
const app = express();
// using the environment varible PORT
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);

  console.log(`server is live on http://localhost:${port}`);
});
