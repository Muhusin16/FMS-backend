const express = require('express');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
require('dotenv').config();

const User = require('../models/userModel');

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Allow 5 registration requests per hour from a single IP
  message: 'Too many registration attempts from this IP, please try again later.',
});

const registerUser = async (req, res) => {
  const { firstName, lastName, email, pwd, gender } = req.body;

  if (!firstName || !lastName || !email || !pwd || !gender) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Apply rate limiting to the registration route
  registerLimiter(req, res, async () => {
    try {
      // Checking if the user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        // User already exists
        return res.status(400).json({ message: 'User already exists' });
      }

      // Generate a verification token
      const verificationToken = jwt.sign({ email }, process.env.SECRET_ACCESS_KEY, { expiresIn: '1hr' });

      const hashedPassword = await bcrypt.hash(pwd, 10);

      // Save user data to the database, including the verification token
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        gender,
        pwd: hashedPassword,
        verificationToken,
        isVerified: false,
      });

      // Send a verification email
      sendVerificationEmail(email, verificationToken);

      return res.status(201).json({ message: 'User Registered Successfully', userId: newUser._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_ACCESS_KEY);

    // Update the user's isVerified status in the database
    const user = await User.findOneAndUpdate(
      { email: decodedToken.email },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with a success message
    return res.status(200).json({ message: 'Email verified', userId: user._id });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

const loginUser = async (req, res) => {
  const { email, pwd } = req.body;

  const user = await User.findOne({ email });
  console.log(user)
  if (!user) {
    
    return res.status(401).json({ message: 'Authentication Failed' });
  }

  const passwordMatch = await bcrypt.compare(pwd, user.pwd);

  if (!passwordMatch) {
    console.log('Incorrect Password');
    return res.status(401).json({ message: 'Incorrect Password' });
  }

  if (!user.isVerified) {
    return res.status(401).json({ message: 'Email not verified' });
  }

  // Generate and send JWT token
  const token = jwt.sign({ email: user.email, userId: user._id }, process.env.SECRET_ACCESS_KEY, { expiresIn: '1h' });
  res.status(200).json({ message: 'Login successful', token });
};

const sendVerificationEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: 'muhusin@zool.in',
    to: email,
    subject: 'Email Verification',
    html: `<p>Please click the following link to verify your email: <a href="http://localhost:5000/api/user/verify-email/${token}">Verify Email</a></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};

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
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerUser, loginUser, homePage, getUser, verifyEmail, getUserById };
