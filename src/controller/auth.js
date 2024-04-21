const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

// Function to generate a random JWT secret key
const generateJwtSecret = () => {
    return require("crypto").randomBytes(64).toString("hex");
  };
const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
     return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please Provide Required Information",
     });
  }

  const hash_password = await bcrypt.hash(password, 10);
 
  const userData = {
     firstName,
     lastName,
     email,
     hash_password,
  };

  const user = await User.findOne({ email });
  if (user) {
     return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User already registered",
     });
  } else {
     User.create(userData).then((data, err) => {
     if (err) res.status(StatusCodes.BAD_REQUEST).json({ err });
     else
       res
        .status(StatusCodes.CREATED)
        .json({ message: "User created Successfully", data:userData });
     });
  }
};
const signIn = async (req, res) => {
    try {
      // Check if email and password are provided
      if (!req.body.email || !req.body.password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Please enter email and password",
        });
      }
  
      // Find the user by email
      const user = await User.findOne({ email: req.body.email });
  
      // If user not found, return appropriate response
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "User not found",
        });
      }
  
      // Authenticate user with provided password
      const isPasswordValid = await bcrypt.compare(req.body.password, user.hash_password);
      if (!isPasswordValid) {
        // If password does not match, return appropriate response
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Invalid email or password",
        });
      }
  
      // If authentication is successful, generate JWT token
      const token = jwt.sign(
        { _id: user._id },
        generateJwtSecret(), // Generate random secret key
        { expiresIn: "30d" }
      );
  
      // Return user details and token in response
      const { _id, firstName, lastName, email } = user;
      res.status(StatusCodes.OK).json({
        token,
        user: { _id, firstName, lastName, email },
      });
    } catch (error) {
      // Handle any server-side errors
      console.error("Error during sign-in:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  };
module.exports = { signUp, signIn};