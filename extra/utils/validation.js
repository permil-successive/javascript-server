import validateEmail from "./helpers"

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

export default validateUsers;
