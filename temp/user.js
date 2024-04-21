  // const mongoose = require('mongoose');
  // const bcrypt = require('bcrypt');

  // const userSchema = new mongoose.Schema({
  //   fullName: { type: String, required: true, unique: true },
  //   email: { type: String, required: true, unique: true },
  //   password: { type: String, required: true },
  // });

  // // Hash password before saving to database
  // userSchema.pre('save', async function(next) {
  //   try {
  //     if (!this.isModified('password')) {
  //       return next();
  //     }
  //     const hashedPassword = await bcrypt.hash(this.password, 10);
  //     this.password = hashedPassword;
  //     next();
  //   } catch (error) {
  //     next(error);
  //   }
  // });

  // const User = mongoose.model('User', userSchema);

  // module.exports = User;

  const mongoose = require('mongoose');
  const bcrypt = require('bcrypt');

  const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  });

  // Hash password before saving to database
  userSchema.pre('save', async function(next) {
    try {
      if (!this.isModified('password')) {
        return next();
      }
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  });

  const User = mongoose.model('User', userSchema);

  module.exports = User;
