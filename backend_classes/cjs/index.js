// dotenv
// this library helps to read the .env file making the key value peer avaliable to the process.env of node
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const sequelize = require("./database");
const jwt = require("jsonwebtoken");
const { User, Session } = require("./models");
const app = express();

// using the environment varible PORT
const port = process.env.PORT;
const hash_salt = Number(process.env.HASH_SALT);
const jwt_secret = process.env.JWT_SECRET;

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
app.post("/login", async (req, res) => {
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

  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: " User not found",
    });
  }

  const valid_password = await bcrypt.compare(password, user?.password);

  if (!valid_password) {
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
  const session = await Session.create({
    user_id: user.id,
  });

  const token = jwt.sign(
    {
      id: session.id,
    },
    jwt_secret,
    { expiresIn: "2 weeks" }
  );
  user.password = undefined;

  return res.json({
    status: "success",
    message: "User Login successful",
    token,
    user,
  });

  // return "User";
});

// register user with demo data
app.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

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
  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(409).json({
        status: "failed",
        message: "Email already taken",
      });
    }
    // let passwordHash;
    const hash = await bcrypt.hash(password, hash_salt);

    await User.create({
      email,
      firstName,
      lastName,
      password: hash,
    });
    return res.json({
      status: "success",
      message: "User Registration successful",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
  // return "User";
});

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.toString()?.replace("Bearer ", "");
  try {
    console.log({ authorization, token });
    if (!token) {
      return res.status(403).json({
        status: "failed",
        message: "Token is Required",
      });
    }
    const { id } = jwt.verify(token, jwt_secret);
    const session = await Session.findByPk(id, { include: User });
    console.log({ session });
    req.session = session;
    req.user = session.User;
    if (!session) {
      return res.status(403).json({
        status: "failed",
        message: "Invalid or Expired Token",
        // error,
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      status: "failed",
      message: "Invalid or Expired Token",
      error,
    });
  }
};

app.all("/logout", authMiddleware, async (req, res) => {
  const { session, user } = req;
  // console.log({ session, user });
  await Session.destroy({
    where: {
      id: session.id,
    },
  });
  console.log("logout successful");
  return res.json({
    status: "success",
    message: "Logout Successful",
  });
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
