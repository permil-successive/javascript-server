import { Iuser, Ipermissions } from './interfaces';

const permissions: Ipermissions = {
  'getUsers' : {
    all: ['head-trainer'],
    read: ['trainee', 'trainer'],
    write: ['trainer'],
    delete: []
  }
};

// list of users
const users: Iuser[] = [
  {
    traineeEmail: 'trainee1@successive.tech',
    reviewerEmail: 'reviewer1@successive.tech',
  }
];

export { users, permissions };
