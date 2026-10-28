const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  isValid,
  isValidObjectId,
  isValidFullName,
  isValidEmail,
  isValidPhone,
  isValidPassword,
} = require("../utils/validator");

// Signup User
const signupUser = async (req, res) => {
  try {
    let userData = req.body;

    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: "Bad Request! No Data Provided" });
    }

    let { fullName, email, password, phone, role } = userData;

    // Full Name Validation
    if (!isValid(fullName)) {
      return res.status(400).json({ msg: "Fullname is Required" });
    }

    if (fullName.trim().length < 2 || !isValidFullName(fullName)) {
      return res.status(400).json({ msg: "Invalid Fullname" });
    }

    // Email Validation
    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is Required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    let duplicateEmail = await UserModel.findOne({ email });
    if (duplicateEmail) {
      return res.status(400).json({ msg: "Email Already Exists" });
    }

    // Password Validation
    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password is Required" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

    // Phone Number Validation
    if (!isValid(phone)) {
      return res.status(400).json({ msg: "Phone Number is Required" });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ msg: "Invalid Phone Number" });
    }

    let duplicatePhone = await UserModel.findOne({ phone });
    if (duplicatePhone) {
      return res.status(400).json({ msg: "Phone Number Already Exists" });
    }

    // Role Validation
    if (role !== undefined) {
      if (!["user", "owner"].includes(role)) {
        return res.status(400).json({ msg: "Role must be user or owner" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    userData.password = hashedPassword;

    const user = await UserModel.create(userData);
    return res
      .status(201)
      .json({ msg: "Registration Completed Successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    let data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "Bad Request! No Data Provided" });
    }

    let { email, password } = data;

    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is Required" });
    }

    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password is Required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ msg: "Incorrect Password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" },
    );

    return res.status(200).json({ msg: "Login Successful", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get My Profile

// Update Profile

// Delete My Profile

// Get All Users (Admin)

// Delete Any User (Admin)


module.exports = { signupUser, loginUser };
