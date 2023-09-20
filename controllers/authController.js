const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../Utils/responseWrapper");

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      //return res.status(400).send('All Fields are required');
      return res.send(error(400, "All Fields are required"));
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      //return res.status(409).send('User all ready Registered');
      res.send(error(409, "User all ready Registered"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    //  return res.status(201).json({
    //   user
    //  });
    return res.send(success(201, "user created successfully"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      // return res.status(400).send('All Fields are required');
      res.send(error(400, "All Fields are required"));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // return res.status(404).send('User is not Registered');
      res.send(error(404, "User is not Registered"));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      //return res.status(403).send('Incorrect Password');
      res.send(error(403, "Incorrect Password"));
    }

    const accessToken = generateAccessToken({
      _id: user._id,
    });
    const refreshToken = generateRefreshToken({
      _id: user._id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(201, { accessToken }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
// internal Function
//this api will check the refershToken validity and generate a new accessToken key
const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    // return res.status(401).send('Refresh Token in cookie is required');
    return res.send(error(401, "Refresh Token in cookie is required"));
  }

  const refreshToken = cookies.jwt;

  try {
    const decode = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    const _id = decode._id;
    const accessToken = generateAccessToken({ _id });
    return res.send(success(201, { accessToken }));
  } catch (error) {
    //return res.status(401).send("Invalid Refresh Key");
    return res.send(error(401, "Invalid Refresh Key"));
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    res.send(success(200, "User Logged Out"));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};
const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    return token;
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
  logoutController,
};
