import IError from '../../libs/IError';

export default {
  create: {
    id: {
      required: true,
      string: true,
      in: ['body'],
      custom: (value: any, errorMessage: IError): boolean => {
        console.log('inside custom validation function');
        console.log('Value', value);
        if (!(value && value.startsWith('A'))) {
          errorMessage.message = 'id is not start with A';
          errorMessage.code = '401';
          return false;
        } else {
          return true;
        }
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
      errorMessage: 'Skip is invalid',
    },
    limit: {
      required: false,
      default: 10,
      number: true,
      in: ['query'],
      errorMessage: 'Limit is invalid',
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
        if (dataToUpdate.id === undefined) {
          errorMessage.message = 'id is required in dataToUpdate';
          return false;
        } else if (dataToUpdate.name === undefined) {
          errorMessage.message = 'name is required in dataToUpdate';
          return false;
        } else if (dataToUpdate.location === undefined) {
          errorMessage.message = 'location is required in dataToUpdate';
          return false;
        } else {
          return true;
        }
      },
    }
  }
};
