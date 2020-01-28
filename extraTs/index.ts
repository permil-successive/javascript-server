import { drawDiamond, drawEquilateralTriangle } from './patterns';
import { hasPermission, validateUsers } from './utils';
import { users } from './constants';

// patterns
drawDiamond(5);
drawEquilateralTriangle(5);


// permissions
console.log(hasPermission('allmodule', 'trainer', 'read'));
console.log(hasPermission('getUsers', 'trainer', 'reead'));
console.log(hasPermission('getUsers', 'trainer', 'write'));
console.log(hasPermission('getUsers', 'trainer', 'delete'));

// validations
validateUsers(users);
