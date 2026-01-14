const User = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get Users
const getUsersController = async (req, res) => {
    const userList = await User.find().select('-passwordHash');

    if (!userList) {
        res.status(500).json({ success: false });
    }
    res.send(userList);
}

//Get User by ID
const getusersByIdController = async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
        return res.status(500).json({ message: 'The user with the given ID was not found.' });
    }
    res.status(200).send(user);
}

// Create User
const createUsersController = async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })
    user = await user.save();
    if (!user)
        return res.status(400).send('the user cannot be created!')
    res.send(user);
}

// user login
const loginUsersController = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.secret;  
    if (!user) {
        return res.status(400).send('The user not found');
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret, //secret,
            { expiresIn: '1d' }
        )
        
        res.status(200).send({ user: user.email, token: token });
    } else {
        res.status(400).send('Password is wrong!');
    }
}

// user registration
const registerUserController = async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })
    user = await user.save();
    if (!user)
        return res.status(400).send('the user cannot be created!')
    res.send(user);
}

// Get user count
const getUserCountController = async (req, res) =>{
  try {
    const userCount = await User.countDocuments();  // Counts all products

    res.status(200).json({ success: true, userCount });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Delete user
const deleteUserByIdController = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });

  } catch (error) {
    console.log("DELETE ERROR =>", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
}

module.exports = {getUsersController, getusersByIdController, getUserCountController, createUsersController, deleteUserByIdController, registerUserController, loginUsersController}