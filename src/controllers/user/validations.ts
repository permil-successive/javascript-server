import IError from '../../libs/IError';

export default {
  create: {
    name: {
      required: true,
      regex: /^[a-z ,.'-]+$/i,
      in: ['body'],
      errorMessage: 'name is required',
    },
    role: {
      required: true,
      in: [ 'body' ],
      errorMessage: 'role is required'
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
      errorMessage: 'email is required'
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
        try {
          new Date(value);
        } catch (err) {
          const errorMessage: IError = {
            message: err.name,
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
      errorMessage: 'imit is invalid',
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
        const errorMessage: IError = {
          message: '',
          code: '400'
        };

        if (typeof dataToUpdate.name !== 'string' || dataToUpdate.name.trim() === '') {

          errorMessage.message = 'name is required of string in dataToUpdate';
          throw errorMessage;

        } else if (typeof dataToUpdate.address !== 'string' || dataToUpdate.address.trim() === '') {

          errorMessage.message = 'address is required of string in dataToUpdate';
          throw errorMessage;
        }

        if (typeof dataToUpdate.email !== 'string' || dataToUpdate.email.trim() === '') {

          errorMessage.message = 'email is required of string in dataToUpdate';
          throw errorMessage;

        } else if (typeof dataToUpdate.mobileNumber !== 'number') {

          errorMessage.message = 'mobileNumber is required of number in dataToUpdate';
          throw errorMessage;
        }

        if (typeof dataToUpdate.dob !== 'string' || dataToUpdate.dob.trim() === '') {

          errorMessage.message = 'dob is required of string and valid date (MM/DD/YYYY) in dataToUpdate';
          throw errorMessage;

        } else if (typeof dataToUpdate.hobbies !== 'object' || (!Array.isArray(dataToUpdate.hobbies))) {

          errorMessage.message = 'hobbies is required of string in dataToUpdate';
          throw errorMessage;
        }

        return true;
      },
    }
  }
};