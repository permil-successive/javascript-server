import { Iuser, Ipermissions } from './utils/interfaces';

export enum PermissionType { read = 'read', write = 'write', delete = 'delete' }

// permissions
export const permissions: Ipermissions = {
  'getUsers' : {
    all: ['head-trainer'],
    read: ['trainee', 'trainer'],
    write: ['trainer'],
    delete: []
  },
  'trainee' : {
    all: ['head-trainer'],
    read: ['trainee', 'trainer'],
    write: ['trainer'],
    delete: []
  }
};

// list of users
export const users: Iuser[] = [
  {
    traineeEmail: 'trainee1@successive.tech',
    reviewerEmail: 'reviewer1@successive.tech',
  }
];
