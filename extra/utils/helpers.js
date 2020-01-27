/**
 *
 * validate the provided email
 * @param {*} email
 * @return Boolean
 */
function validateEmail(email) {

  //regular expression
  const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@successive.tech/mg;

  //test the regular expression and return test result
  return regex.test(email);
}

export default validateEmail;
