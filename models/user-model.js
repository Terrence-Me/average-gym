const bcrypt = require('bcryptjs');

const db = require('../data/database');

class User {
  constructor(email, password, firstName, lastName) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
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
}

module.exports = User;