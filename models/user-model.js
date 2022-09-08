const bcrypt = require('bcryptjs');

const db = require('../data/database');

class User {
  constructor(email, password, firstName, lastName) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getUserWithEmail() {
    return db.getDb().collection('users').findOne({ email: this.email });
  }

  async existsAlready() {
    const existingUser = await this.getUserWithEmail();
    if (existingUser) {
      return true;
    }
    return false;
  }

  async signup() {
    const hashedPassward = await bcrypt.hash(this.password, 12);

    const result = await db.getDb().collection('users').insertOne({
      email: this.email,
      password: hashedPassward,
      firstName: this.firstName,
      lastName: this.lastName,
    });
    console.log(result);
  }

  comparePassward(hashedPassward) {
    return bcrypt.compare(this.password, hashedPassward);
  }
}

module.exports = User;
