import { Iuser, Ipermissions } from './routes/utils';

export enum PermissionType { read = 'read', write = 'write', delete = 'delete' }
export enum Roles { 'head-trainer', trainee, trainer }

// permissions
export const permissions: Ipermissions = {
  'users' : {
    all: ['head-trainer'],
    read: ['trainee', 'trainer'],
    write: ['trainer'],
    delete: []
  },
  'trainee' : {
    all: ['head-trainer'],
    read: ['head-trainer', 'trainer'],
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
