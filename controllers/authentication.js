const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

const tokenForUser = (user) => {
  const timeStamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timeStamp }, config.jwtSecret)
}

exports.signin = (req, res, next) => {
  // User has already had their email and password auth'd and have to receive a token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = (req, res, next) => {

  const email = String(req.body.email); //!TODO - check if String() is needed
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password'});
  }

  // See if user with the given email exists
  User.findOne({ email: email }, (err, existingUser) => {
    if (err) { return next(err); }

    // If user with email does exist - return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Such user already exists '});
    }

    // If user with email does not exist - create and save user record
    const user = new User({
      email: email,
      password: password
    });

    user.save(err => {
      if (err) { return next(err); }

      // Respond to request indicating that user was created
      res.json({ token: tokenForUser(user) });
    });
  });

}
