import { permissions } from '../constants';
import { Iuser } from '../interfaces';

/**
 * checks objects exist or not
 * @param {} obj
 * @returns Boolean
 */
function validateObject(obj: object): boolean {
  return obj !== undefined && obj !== null;
}

/**
 * check given permissions of given role in provided module.
 * @param {*} module i.e. get users
 * @param {*} role i.e. head-trainer
 * @param {*} permissionsType i.e. read, write
 *
 * @returns Boolean
 */
function hasPermission(module: string, role: string, permissionsType: string): boolean {
  const currentModule: Iuser = permissions[module];

  // checking module exist or not
  console.log(`value of currentModule - ${currentModule}`);
  if (validateObject(currentModule)) {
    // users having current permissions
    const users: string[] = currentModule[permissionsType];
    if (validateObject(users)) {
      console.log(`List of users having ${permissionsType} permission`);
      console.log(users);

      return users.some((userType) => {
        return userType === role;
      });
    }
  }
  return false;
}

export default hasPermission;
