//list of users
const users = [
  {
    traineeEmail: 'trainee1@successive.tech',
    reviewerEmail: 'reviewer1@successive.tech',
  }
]


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


/**
 * this function checks every users in array, validate their emails and print number
 * of valid and invalid users.
 * @param {*} myusers array of users having trainee and reviewers emails.
 */
function validateUsers(myusers) {
  let validatedUsers = {valid:[], invalid:[]};
  myusers.forEach(element => {
    const {traineeEmail, reviewerEmail} = element;
    if(validateEmail(traineeEmail) && validateEmail(reviewerEmail))
      validatedUsers.valid.push(element);
    else
      validatedUsers.invalid.push(element);
  });

  console.log(`Number of valid users - ${validatedUsers.valid.length}\nlist of valid users : ${JSON.stringify(validatedUsers.valid)}`);
  console.log(`Number of invalid users - ${validatedUsers.invalid.length}\nList of invalid users : ${JSON.stringify(validatedUsers.invalid)}`);
}

validateUsers(users);
