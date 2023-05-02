const User = require("../model/userSchema");
const bcryptjs = require("bcryptjs");
const Jwt = require("jsonwebtoken");
const getUser = async (req, res) => {
  console.log(typeof process.env.SECRETE_KEY);
  try {
    const getUser = await User.find();
    if (getUser.length === 0) {
      throw {
        message: "No User Faund",
      };
    }
    if (getUser) {
      res.json(getUser);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!(name && email && password)) {
      throw {
        message: "All field Are required",
      };
    }
    const user = await User.findOne({ email });
    if (user) {
      throw {
        message: "user already exists",
      };
    }
    const hashPassword = await bcryptjs.hash(password, 10);

    let createUser = await User.create({
      name,
      email,
      password: hashPassword,
      places: [],
      imageUrl: req.file.path,
    });
    let generateToken = Jwt.sign(
      { id: createUser._id, email: createUser.email },
      process.env.SECRETE_KEY,
      { expiresIn: "1h" }
    );
    createUser.token = generateToken;
    res.status(200).json({
      id: createUser._id,
      email: createUser.email,
      token: generateToken,
    });
  } catch (error) {
    if (Object.keys(error).length === 0) {
      res.status(400).json({ message: "invalid information" });
    } else {
      res.status(400).json(error);
    }
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      throw {
        message: "Please Fill Valid information",
      };
    }
    const user = await User.findOne({ email });
    const checkPass = await bcryptjs.compare(password, user.password);
    if (!user) {
      throw {
        message: "invalid Creditials",
      };
    }
    if (!checkPass) {
      throw {
        message: "invalid Creditials",
      };
    }
    const generateToken = Jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRETE_KEY,
      { expiresIn: "1h" }
    );
    user.token = generateToken;
    res.json({ id: user._id, email: user.email, token: generateToken });
  } catch (error) {
    if (Object.keys(error).length === 0) {
      res.status(400).json({ message: "invalid information" });
    } else {
      res.status(400).json(error);
    }
  }
};
exports.getUser = getUser;
exports.signup = signup;
exports.signin = signin;
