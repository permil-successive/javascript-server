import { permissions } from '../../constants';
import { IgetUser } from './interfaces';

/**
 * check given permissions of given role in provided module.
 * @param {*} module i.e. get users
 * @param {*} role i.e. head-trainer
 * @param {*} permissionsType i.e. read, write
 *
 * @returns Boolean
 */
function hasPermission(module: string, role: string, permissionsType: string): boolean {
  const currentModule: IgetUser = permissions[module];

  // checking module exist or not
  console.log(`value of currentModule - ${currentModule}`);

  if (currentModule !== undefined) {
    return currentModule.all.includes(role) || currentModule[permissionsType].includes(role);
  }
  return false;
}

export default hasPermission;
