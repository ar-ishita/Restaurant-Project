/******************************************************************************
 *   ITE5315 – Project
 *   I declare that this assignment is my own work in accordance with Humber Academic Policy.
 *   No part of this assignment has been copied manually or electronically from any other source
 *   (including web sites) or distributed to other students.
 *
 *   Group member Name: Spencer Standish     Student IDs: N01576620      Date: 05/12/2023
 *   Group member Name: Ishita Arora     Student IDs: N01543414      Date: 05/12/2023
 ******************************************************************************/
require("dotenv").config();
const userInfo = require("../models/UserLoginSchema");
const saltRounds = 10;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//login rendering

exports.getUserLogin = (req, res) => {
  console.log("login page called");
  res.render("login", { title: "LoginPage" });
};

exports.addUserLogin = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user1 = await userInfo.findOne({ username }).exec();

    if (user1) {
      const result = await bcrypt.compare(password, user1.password);

      if (result) {
        console.log("Password matches through bcrypt");

        // Generate a JWT token
        const token = jwt.sign(
          { username: user1.username, userId: user1._id },
          process.env.JWT_SECRET_KEY
        );

        // Send the token in the response
        res.status(200).json({ token });
      } else {
        // Passwords do not match
        console.log("Password does not match");
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      // User not found
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserRegister = (req, res) => {
  console.log("register route called");
  res.render("register", { title: "LoginPage" });
};

exports.addUserRegister = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user document with the hashed password
    const newUser = await userInfo.create({
      username,
      password: hashedPassword,
      email,
    });

    // User registered successfully
    console.log("User registered successfully");
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
