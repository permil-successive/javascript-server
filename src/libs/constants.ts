import { Iuser, Ipermissions } from './routes/utils';

export enum PermissionType { read = 'read', write = 'write', delete = 'delete' }

// permissions
export const permissions: Ipermissions = {
  'users' : {
    all: ['head-trainer'],
    read: ['trainee', 'trainer'],
    write: ['trainer'],
    delete: []
  },
  'trainee' : {
    all: [],
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
