const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  firstName: {
     type: String,
     require: true,
     trim: true,
     min: 3,
     max: 20,
  },
  lastName: {
     type: String,
     require: true,
     trim: true,
     min: 3,
     max: 20,
  },

  email: {
     type: String,
     require: true,
     trim: true,
     unique: true,
     lowercase: true,
  },
  hash_password: {
     type: String,
     require: true,
  },
 
},{ timestamps: true });
// Ensure uniqueness of fullName field
userSchema.index({ firstName: 1, lastName: 1 }, { unique: true });
//For get fullName from when we get data from database

userSchema.method({
  async authenticate(password) {
     return bcrypt.compare(password, this.hash_password);
  },
});
module.exports = mongoose.model("User", userSchema);