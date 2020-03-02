import { IError } from '../../libs';
import { validateEmail } from '../../libs';

export default {
  create: {
    name: {
      required: true,
      regex: /^[a-z ,.'-]+$/i,
      in: ['body'],
      errorMessage: 'name is required',
    },
    address: {
      required: true,
      string: true,
      in: [ 'body' ],
      errorMessage: 'address is required'
    },
    email: {
      required: true,
      string: true,
      in: [ 'body' ],
      errorMessage: 'email is required',
      custom: (value) => {
        if (!validateEmail(value)) {
          throw new Error('email is invalid');
        }
      }
    },
    mobileNumber: {
      required: true,
      number: true,
      in: [ 'body' ],
      errorMessage: 'mobileNumber is required'
    },
    dob: {
      required: true,
      in: [ 'body' ],
      errorMessage: 'dob is required and must be a valid date',
      custom: (value) => {
        if ( isNaN(Date.parse(value)) ) {
          const errorMessage: IError = {
            message: 'Invalid Date',
            code: '400'
          };

          throw errorMessage;
        }
      }
    },
    hobbies: {
      required: true,
      in: [ 'body' ],
      errorMessage: 'hobbies is required',
      custom: (value) => {
        try {
          if (!Array.isArray(value))
            throw { message: 'hobbies must be string array' };
        } catch (err) {
          const errorMessage: IError = {
            message: err.name,
            code: '400'
          };

          throw errorMessage;
        }
      }
    },
    password: {
      required: true,
      in: [ 'body' ],
      string: true,
      errorMessage: 'password is required',
    }
  },
  delete: {
    id: {
      required: true,
      errorMessage: 'id is required',
      in: ['params']
    }
  },
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
  update: {
    id: {
      required: true,
      string: true,
      in: ['body']
    },
    dataToUpdate: {
      in: ['body'],
      required: true,
      isObject: true,
      custom: (dataToUpdate: any): boolean => {

        const ERROR_CODE = '400';

        const errorMessages: IError[] = [];

        const { name, address, mobileNumber, dob, hobbies } = dataToUpdate;

        if (typeof name !== 'string' || name.trim() === '') {

          errorMessages.push({
            message: 'name is required of string in dataToUpdate',
            code: ERROR_CODE
          });

        }

        if (typeof address !== 'string' || address.trim() === '') {

          errorMessages.push({
            message: 'address is required of string in dataToUpdate',
            code: ERROR_CODE
          });

        }

        if (typeof mobileNumber !== 'number') {

          errorMessages.push({
            message: 'mobileNumber is required of number in dataToUpdate',
            code: ERROR_CODE
          });

        } else if ( !( mobileNumber >= 1e9 && mobileNumber < 1e10  ) ) {

          errorMessages.push({
            message: 'mobileNumber is not valid in dataToUpdate',
            code: ERROR_CODE
          });

        }

        if (isNaN(Date.parse(dob))) {

          errorMessages.push({
            message: 'dob (MM/DD/YYYY) is required of string in dataToUpdate',
            code: ERROR_CODE
          });

        }

        if ( !hobbies ) {

          errorMessages.push({
            message: 'hobbies is required in dataToUpdate',
            code: ERROR_CODE
          });

        } else if ( (!Array.isArray(hobbies)) ) {

          errorMessages.push({
            message: 'hobbies is must be array in dataToUpdate',
            code: ERROR_CODE
          });

        }

        if (errorMessages.length > 0) {
          throw errorMessages;
        }

        Object.keys(dataToUpdate).forEach((element) => {
          const allowed = ['name', 'address', 'mobileNumber', 'dob', 'hobbies'];
          if (allowed.indexOf(element) === -1)
            delete dataToUpdate[element];
        });

        return true;
      },
    }
  }
};
