/**
 *
 * validate the provided email
 * @param {string} email
 * @returns Boolean
 */
function validateEmail(email: string): boolean {

  // regular expression
  const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@successive.tech/mg;

  // test the regular expression and return test result
  return regex.test(email);
}

export default validateEmail;
