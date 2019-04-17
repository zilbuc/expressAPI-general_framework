const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define user model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On Save Hook, encrypt password
// Before saving a model - run .pre(), function(next) required to do the hashing
userSchema.pre('save', function(next) {
  // Get access to the user model
  const user = this;

  // generate a salt, then run a callback
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }

    // hash the password using the salt, then run a callback
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

//
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

// Create the model class (collection 'user' with userSchema)
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
