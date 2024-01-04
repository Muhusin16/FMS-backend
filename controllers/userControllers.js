// const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
// const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const { firstName, lastName, email, pwd,cpwd, gender } = req.body;

  if (!firstName || !lastName || !email || !pwd || !cpwd || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Checking if the user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    // User already exists
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password before saving it to the database
  // const hashedPassword = await bcrypt.hash(pwd, 10);

  await User.create({
    firstName,
    lastName,
    email,
    gender,
    pwd,
    cpwd // Save the hashed password
  });

  return res.status(201).json({ message: "User Registered Successfully" });
};

const loginUser = async (req, res) => {
  const { email, pwd } = req.body;
  
  const user = await User.findOne({ email })

  if(!user) {
    return res.status(401).json({ message: "Authentication Failed"});
  }else {
    console.log(user)
  }

  // const passwordMatch = await bcrypt.compare(pwd, user.pwd);

  if (user.pwd !== pwd) {
    return res.status(401).json({ message: 'Incorrect Password' });
  }

  res.status(200).json({ message: 'Login successful', user: { email: user.email } });
}

const homePage = async (req, res) =>{
  try{
     const user = req.user
     if (!user) {
      return res.status(401).json({ message: 'User Not Found'});
     }
     res.status(200).json({
      message: `Welcome to the home page ${user.firstName} ${user.lastName}`
     })
  }catch(error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error"})
  }
}

const getUser = async (req, res) => {
  try {
    const { email } = req.body;
  
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User found',
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { registerUser, loginUser, homePage, getUser };
