const permissions = {
  'getUsers': {
    all: ['head-trainer'],
    read: ['trainee', 'trainer'],
    write: ['trainer'],
    delete: []
  }
}
/**
 * checks objects exist or not
 * @param {} obj
 * @returns Boolean
 */
function validateObject(obj) {
  return obj != undefined && obj != null;
}

/**
 * check given permissions of given role in provided module.
 * @param {*} module i.e. get users
 * @param {*} role i.e. head-trainer
 * @param {*} permissionsType i.e. read, write
 *
 * @returns Boolean
 */
function hasPermission(module, role, permissionsType) {
  const currentModule = permissions[module];

  //checking module exist or not
  console.log(`value of currentModule - ${currentModule}`);
  if(validateObject(currentModule)) {
    //users having current permissions
    let users = currentModule[permissionsType];
    if(validateObject(users)){
      console.log(`List of users having ${permissionsType} permission`);
      console.log(users);

      return users.some(userType => {
        return userType == role;
      });
    }
  }
  return false;
}

console.log(hasPermission("allmodule", "trainer", 'read'));
console.log(hasPermission("getUsers", "trainer", 'reead'));
console.log(hasPermission("getUsers", "trainer", 'write'));
console.log(hasPermission("getUsers", "trainer", 'delete'));
