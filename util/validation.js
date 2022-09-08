function isEmpty(value) {
  return !value || value.trim() === '';
}

function userDetailsAreValid(email, password, firstname, lastname) {
  return (
    email &&
    email.includes('@') &&
    password &&
    password.trim().length >= 6 &&
    !isEmpty(firstname) &&
    !isEmpty(lastname)
  );
}

module.exports = userDetailsAreValid;
