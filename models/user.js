var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 99
  },
  email: { // TODO: Need to add email validation
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 99
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 99
  },
  image: String
});

// Override 'toJSON' to prevent the password from being returned with the user
userSchema.set('toJSON', {
  transform: function(doc, user, options) {
    var returnJson = {
      id: user._id,
      email: user.email,
      name: user.name,
      image: user.image
    };
    return returnJson;
  }
});

// Returns true if password hashes match, otherwise false
userSchema.methods.authenticated = function(password) {
  return bcrypt.compareSync(password, this.password);
}

// Mongoose's version of a beforeCreate hook
// Change so that this doesn't happen on update, only create
userSchema.pre('save', function(next) {
  var hash = bcrypt.hashSync(this.password, 10);
  // store the hash as the user's password
  this.password = hash;
  next();
});

module.exports = mongoose.model('User', userSchema);
