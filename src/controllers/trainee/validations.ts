import { IError } from '../../libs';

export default {
  create: {
    id: {
      required: true,
      string: true,
      in: ['body'],
      custom: (value: any): boolean => {
        console.log('inside custom validation function');
        console.log('Value', value);
        if (!(value && value.startsWith('A'))) {
          const errorMessage: IError = {
            message: 'id is not start with A',
            code: '400'
          };

          throw errorMessage;
        }

        return true;
      }
    },
    name: {
      required: true,
      regex: /^[a-z ,.'-]+$/i,
      in: ['body'],
      errorMessage: 'Name is required',
    }
  },
  delete: {
    id: {
      required: true,
      errorMessage: 'Id is required',
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
        if (typeof dataToUpdate.name !== 'string' || dataToUpdate.name.trim() === '') {
          const errorMessage: IError = {
            message: 'name is required of string in dataToUpdate',
            code: '400'
          };

          throw errorMessage;
        } else if (typeof dataToUpdate.location !== 'string' || dataToUpdate.location.trim() === '') {
          const errorMessage: IError = {
            message: 'location is required of string in dataToUpdate',
            code: '400'
          };

          throw errorMessage;
        }

        return true;
      },
    }
  }
};
