// dotenv
// this library helps to read the .env file making the key value peer avaliable to the process.env of node
require("dotenv").config();
const express = require("express");
const sequelize = require("./database");
const app = express();
// using the environment varible PORT
const port = process.env.PORT;

// enabled reading of json and url-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// const user = {
//   email: "email@email.com",
//   password: "password",
// };

const PASSWORD_REGEX =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,}$/;

const PASSWORD_ERROR =
  "Password must be 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character";

const EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

const users = [
  {
    email: "email@email.com",
    password: "Password2!",
  },
];

// login user with demo data
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const errors = [];

  if (!EMAIL_REGEX.test(email)) {
    errors.push({
      feild: "email",
      error: "Invalid Email format",
    });
  }

  if (!PASSWORD_REGEX.test(password)) {
    errors.push({
      feild: "password",
      error: PASSWORD_ERROR,
    });
  }

  if (errors.length) {
    return res.status(400).json({
      status: "failed",
      errors,
    });
  }

  const user = users.find(
    (u) => u?.email?.toLowerCase() === email?.toLowerCase()
  );

  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: " User not found",
    });
  }

  if (password !== user?.password) {
    errors.push({
      feild: "password",
      error: "Password does not match",
    });
  }

  if (email !== user?.email) {
    errors.push({
      feild: "email",
      error: "Email not found",
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

// register user with demo data
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  const errors = [];

  if (!EMAIL_REGEX.test(email)) {
    errors.push({
      feild: "email",
      error: "Invalid Email format",
    });
  }

  if (!PASSWORD_REGEX.test(password)) {
    errors.push({
      feild: "password",
      error: PASSWORD_ERROR,
    });
  }

  if (errors.length) {
    return res.status(400).json({
      status: "failed",
      errors,
    });
  }

  const user = users.find(
    (u) => u?.email?.toLowerCase() === email?.toLowerCase()
  );

  if (user) {
    return res.status(409).json({
      status: "failed",
      message: "Email already taken",
    });
  }
  users.push({ email, password });

  return res.json({
    status: "success",
    message: "User Registration successful",
    users,
  });

  // return "User";
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);

  console.log(`server is live on http://localhost:${port}`);
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
