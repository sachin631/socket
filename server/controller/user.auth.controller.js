const userAuthModel = require("../models/user.auth.model");

const userController = {
  user_register: async (req, res) => {
    const { email, password, first_name, last_name } = req.body;
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ message: "PLEASE PROVIDE FULL DETAILS" });
    }

    const is_user = await userAuthModel.findOne({ email });
    if (is_user) {
      return res.status(400).json({ message: "user already existed" });
    }

    const user = await userAuthModel.create({
      first_name,
      last_name,
      email,
      password,
    });

    if (!user) {
      return res
        .status(200)
        .json({ message: "user register failed", data: user });
    }
    return res.status(200).json({
      message: "user register successfully try to login..",
      data: user,
    });
  },

  user_login: async (req, res) => {
    //get data//check email exist or not //compare password //getreate token both//store token in cookie
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "please provide all required details" });
    }

    const user = await userAuthModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user not exist " });
    }

    const compare_password = await user.compare_password(password);
    if (!compare_password) {
      return res.status(200).json({ message: "email or password is invalid" });
    }

    const access_token = await user.access_token();
    const refresh_token = await user.refresh_token();

    if (!access_token && !refresh_token) {
      return res.status(400).json({ message: "error while store token" });
    }

    res
      .cookie("access_token", access_token, {
        expireIn: "1d",
        httpOnly: true,
      })
      .cookie("refresh_token", refresh_token, {
        expireIn: "10d",
        httpOnly: true,
      });

    return res.status(200).json({ message: "login successfully", user: user });
  },

  user_logout: async (req, res) => {
    res.clearCookie("access_token").clearCookie("refresh_token");
    res.status(200).json({ message: "logot successfully" });
  },

  user_list: async (req, res) => {
    try {
      const users = await userAuthModel.find({});
      if (!users) {
        return res.status(400).json({ message: "user not found" });
      }
      return res.status(200).json({ data: users });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  user_details: async (req,res) => {
    try {
      let login_user_id=req.loginUser
     
      const user = await userAuthModel.findOne({ _id: login_user_id });
      if (!user) {
        res.status(400).json({ message: "user not found or invalid _id" });
      }
      const user_details = await userAuthModel.findById({ _id: login_user_id });
      if (!user_details) {
        res.status(400).json({ message: "user not found " });
      }
      res
        .status(200)
        .json({ data: user, message: "user fetched successfully" });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
};

module.exports = { ...userController };
