const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const config = require("config");

const router = express.Router();
const User = require("../models/User");

router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

//route: http://localhost:5000/users/register
//desc: register new user
//isPrivate: false
router.post("/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (user) {
      return res.json({ msg: "user already exist" });
    }
    const newUser = new User({
      name: name,
      email: email,
      password: password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        newUser.password = hash;

        newUser
          .save()
          .then(saved =>
            jwt.sign(
              { id: saved._id },
              config.get("secretKEY"),
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({ token: "Bearer " + token, saved });
              }
            )
          )
          // res.json(saved))
          .catch(err => console.log(err));
      });
    });
  });
});

//route: http://localhost:5000/login
//desc: login user
//isPrivate: false
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(400).json({ msg: "email not found" });
    }
    bcrypt.compare(password, user.password).then(isMatched => {
      if (isMatched) {
        const payload = { id: user.id, email: user.email };
        jwt.sign(
          payload,
          config.get("secretKEY"),
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.json({ token: "Bearer " + token });
          }
        );
      } else {
        return res.status(400).json({ msg: "password incorrect" });
      }
    });
  });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
