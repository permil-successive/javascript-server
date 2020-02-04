interface Ipermissions {
  getUsers: IgetUser;
  trainee: IgetUser;
}

interface IgetUser {
  all: string[];
  read: string[];
  write: string[];
  delete: string[];
}

interface Iuser {
  traineeEmail: string;
  reviewerEmail: string;
}

interface IvalidatedUsers {
  valid: Iuser[];
  invalid: Iuser[];
}

export { Ipermissions, IgetUser, Iuser, IvalidatedUsers };
