import { Request, Response, NextFunction } from 'express';
import IError from './IError';

const ERROR_CODE = '400';

/**
 * validate the config of the variable as assign default values, if required
 *
 * @param validationConfig config of the variable for validation
 */
function validateValidationConfig (validationConfig): void {

  // assigning default config
  validationConfig.required = (
    validationConfig.required === undefined ? true : validationConfig.required
  );
  validationConfig.in = validationConfig.in || [ 'body' ];

  // checking validation.in data
  const ValidationInSet = [ 'body', 'params', 'query' ];
  validationConfig.in.forEach((element) => {
    if (ValidationInSet.indexOf(element) === -1) {
      const errorMessage: IError = {
        message: `${element} is not permitted to use in the 'in' key`,
        code: ERROR_CODE
      };
      throw errorMessage;
    }
  });
}

/**
 * assign default value to variable if required
 *
 * @param validationConfig config of the variable for validation
 * @param toValidate variable to validate
 */
function assignDefualtValue(validationConfig, toValidate): any {

  if ((validationConfig.default !== undefined) && !toValidate) {
    return validationConfig.default;
  }

  return toValidate;
}

/**
 * checking for regex for the variable
 *
 * @param toValidate variable to validate
 * @param regex a regular expression
 * @param key key of variable
 *
 */
function isRegex(validationConfig, toValidate: string, key: string): boolean {

  const regex: RegExp = validationConfig.regex;
  if (regex && (!regex.test(toValidate))) {
    console.debug(`error in regex`);
    const error: IError = {
      message: `${key} is not as per required data. `,
      code: ERROR_CODE
    };
    throw error;
  } else {
    return validationConfig.regex;
  }
}

/**
 * checking variable for required
 *
 * @param validationConfig config of the variable for validation
 * @param toValidate a variable to validate
 * @param key key of variable
 */
function isRequired(validationConfig, toValidate, key: string): boolean {

  if (
    validationConfig.required &&
    (toValidate === undefined || toValidate === null ||
      (typeof toValidate === 'string' && toValidate.trim() === '')
    )
  ) {
    console.debug(`error in required`);
    const error: IError = {
      message: `${key} is required. `,
      code: ERROR_CODE
    };

    throw error;
  }

  return validationConfig.required;
}

/**
 * checking datatype of variable for string
 *
 * @param validationConfig config of the variable for validation
 * @param toValidate a variable to validate
 * @param key key of variable
 */
function isString(validationConfig, toValidate, key: string): boolean {

  if (validationConfig.string && typeof toValidate !== 'string') {
    console.debug(`error in string datatype`);
    const error: IError = {
      message: `${key} is not as per defined datatype. `,
      code: ERROR_CODE
    };

    throw error;
  }

  return validationConfig.string;
}

/**
 * checking datatype of variable for number
 *
 * @param validationConfig config of the variable for validation
 * @param toValidate a variable to validate
 * @param key key of variable
 */
function isNumber(validationConfig, toValidate, key: string): boolean {

  if (validationConfig.number && isNaN(parseInt(toValidate, 10))) {
    console.debug(`error in number  datatype`);
    const error: IError = {
      message: `${key} is not as per required data. `,
      code: ERROR_CODE
    };
    throw error;
  }

  return validationConfig.number;
}

/**
 * checking datatype of variable for object
 *
 * @param validationConfig config of the variable for validation
 * @param toValidate a variable to validate
 * @param key key of variable
 */
function isObject(validationConfig, toValidate, key: string): boolean {

  if (validationConfig.isObject && (typeof toValidate !== 'object' || Array.isArray(toValidate))) {
    console.debug(`error in object datatype`);
    const error: IError = {
      message: `${key} is not as per defined datatype. `,
      code: ERROR_CODE
    };
    throw error;
  }

  return validationConfig.isObject;
}

/**
 * checking for custom validation on variable
 *
 * @param validationConfig config of the variable for validation
 * @param toValidate a variable to validate
 */
function isCustom(validationConfig, toValidate): boolean {

  if (validationConfig.custom && !validationConfig.custom(toValidate)) {
    console.debug(`calling custom validation callback`);
    return false;
  }

  return validationConfig.custom;
}

export default (config) => (req: Request, res: Response, next: NextFunction) => {
  console.info('====== inside validation handler =======');
  console.debug('req.body = ', req.body);
  console.debug('config = ', config);

  const errorMessages = [];
  const variableCounts = {
    body: 0,
    params: 0,
    query: 0
  };

  Object.keys(config).forEach((key) => {
    console.debug(`-----------------------`);
    console.debug(`key = ${key}`);

    const validationConfig = config[key];

    try {

      validateValidationConfig(validationConfig);

    } catch (err) {

      const errorMessage: IError = err || { code: '500', message: 'Unexpected expected error'};

      // override config default error message
      if (validationConfig.errorMessage !== undefined) {
        errorMessage.message = validationConfig.errorMessage;
      }

      console.debug(`Key = ${key}, error message = `, errorMessage);
      errorMessages.push(errorMessage);
    }

    validationConfig.in.forEach((element) => {

      console.debug(`in = ${element}`);

      let toValidate = req[element][key];

      console.debug(`tovalidate = ${toValidate}`);

      // checking for not required and not supplied variable
      if (
        !validationConfig.required
        && toValidate === undefined
        && (validationConfig.default === undefined)
      ) {
        console.debug('inside return require');
        return;
      }

      // assigning default value
      toValidate = req[element][key] = assignDefualtValue(validationConfig, toValidate);

      // counting the safe variable
      variableCounts[element]++;

      try {
        isRequired(validationConfig, toValidate, key);
        isString(validationConfig, toValidate, key);
        if (isNumber(validationConfig, toValidate, key))
          toValidate = req[element][key] = parseInt(toValidate, 10); // assigning back number
        isObject(validationConfig, toValidate, key);
        isRegex(validationConfig, toValidate, key);
        isCustom(validationConfig, toValidate);
      } catch (err) {

        const errorMessage: IError = err || { code: '500', message: 'Unexpected expected error'};

        // override config default error message
        if (validationConfig.errorMessage !== undefined) {
          errorMessage.message = validationConfig.errorMessage;
        }

        console.debug(`Key = ${key}, error message = `, errorMessage);

        if (Array.isArray(errorMessage)) {
          errorMessages.push(...errorMessage);
        } else {
          errorMessages.push(errorMessage);
        }

      }
    });
  });

  // checking for extra variables
  if (
    (Object.keys(req.body).length > variableCounts.body) ||
    (Object.keys(req.params).length > variableCounts.params) ||
    (Object.keys(req.query).length > variableCounts.query)
  ) {
    const errorMessage: IError = { code: '401', message: 'Unexpected variables supplied'};
    errorMessages.push(errorMessage);
  }

  if (errorMessages.length > 0)
    return next(errorMessages);

  next();
};
