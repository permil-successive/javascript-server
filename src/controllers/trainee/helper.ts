import { parseStringQuery, Roles } from '../../libs';
import { ISearch } from '../../repositories/entities';

export const getSeachQryforGet = (searchQuery, role) => {
  const exludeUsers = [...Array(Roles[role]).keys()].map((i) => Roles[i]);
  console.log('excludeUsers =', exludeUsers);
  const search: ISearch = parseStringQuery(searchQuery, (value) => {
    const regExpToSearch = new RegExp(value, 'i');
    console.info('regExpToSearch = ', regExpToSearch);
    return regExpToSearch;
  });
  const exclude = { role: { '$nin': exludeUsers } };
  return  { ...search, ...exclude };
};

export const checkUpdatePermission = async(userRepo, id, currentUser) => {
  const notPermittedUsers = [...Array(Roles[currentUser.role]).keys()].map((i) => Roles[i]);
  console.log('notPermittedUsers =', notPermittedUsers);

  const originalData = await userRepo.findOne({originalId: id});

  if (notPermittedUsers.indexOf(originalData.role) >= 0 ) {
    throw { message: 'not permitted to edit this record', code: '401'};
  }
};
