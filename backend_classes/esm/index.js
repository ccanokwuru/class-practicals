import express, { json, urlencoded } from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);

  console.log(`server is live on http://localhost:${port}`);
});
