import { IError } from '../../libs';
import { validateEmail } from '../../libs';

export default {
  get: {
    skip: {
      required: false,
      default: 0,
      number: true,
      in: ['query'],
      errorMessage: 'skip is invalid',
    },
    limit: {
      required: false,
      default: 10,
      number: true,
      in: ['query'],
      errorMessage: 'limit is invalid',
    },
    sort: {
      required: false,
      string: true,
      in: [ 'query' ]
    },
    search: {
      required: false,
      in: [ 'query' ]
    }
  },
  login: {
    email: {
      required: true,
      string: true,
      in: ['body']
    },
    password: {
      required: true,
      string: true,
      in: ['body']
    }
  }
};
