// dotenv
// this library helps to read the .env file making the key value peer avaliable to the process.env of node
require("dotenv").config();
const express = require("express");
const app = express();
// using the environment varible PORT
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// login user with demo data
app.post("/login", (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  const user = {
    email: "email@email.com",
    password: "password",
  };

  const errors = [];

  if (email !== user.email) {
    errors.push({
      feild: "email",
      error: "Email not found",
    });
  }
  if (password !== user.password) {
    errors.push({
      feild: "password",
      error: "Password does not match",
    });
  }

  if (errors.length) {
    return res.status(403).json({
      status: "failed",
      errors,
    });
  }

  return res.json({
    status: "success",
    message: "User Login successful",
    user,
  });

  // return "User";
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);

  console.log(`server is live on http://localhost:${port}`);
});
