import IError from '../../libs/IError';

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
            code: '401'
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
      custom: (dataToUpdate: any, errorMessage: IError): boolean => {
        if (typeof dataToUpdate.name !== 'string' || dataToUpdate.name.trim() === '') {
          errorMessage.message = 'name is required in dataToUpdate';
          return false;
        } else if (typeof dataToUpdate.location !== 'string' || dataToUpdate.location.trim() === '') {
          errorMessage.message = 'location is required in dataToUpdate';
          return false;
        } else {
          return true;
        }
      },
    }
  }
};
