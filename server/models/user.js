const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});


userSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.passwordHash = bcrypt.hashSync(password, 10); // Hash the password
  })
  .get(function() {
    return this._password;
  });

// Method to compare passwords
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};


const User = mongoose.model('User', userSchema);
module.exports = User;
