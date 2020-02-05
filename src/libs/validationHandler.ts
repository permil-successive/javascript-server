import { Request, Response, NextFunction } from 'express';
import IError from './IError';

/**
 * validate the config of the variable as assign default values, if required
 *
 * @param validationConfig config of the variable for validation
 */
function validateValidationConfig (validationConfig): void {

  // assigning default config
  validationConfig.required = validationConfig.required === undefined ? true : validationConfig.required;
  validationConfig.in = validationConfig.in || [ 'body' ];

  // checking validation.in data
  const ValidationInSet = [ 'body', 'params', 'query' ];
  validationConfig.in.forEach((element) => {
    if (ValidationInSet.indexOf(element) === -1)
      throw { message: 'only use thse elements ("body", "params", "query") "in" key', code: 500};
  });
}

/**
 * assign default value to variable if required
 *
 * @param validationConfig config of the variable for validation
 * @param toValidate variable to validate
 */
function assignDefualtValue(validationConfig, toValidate): any {

  if (validationConfig.default && !toValidate) {
    return validationConfig.default;
  } else {
    return toValidate;
  }
}

/**
 * checking for regex for the variable
 *
 * @param toValidate variable to validate
 * @param regex a regular expression
 * @param errorMessage an error message in case of error
 * @param key key of variable
 */
function checkRegex(toValidate: string, regex: RegExp, errorMessage: IError, key: string): boolean {

  if (regex && regex.test(toValidate)) {
    console.debug(`checking for regex`);
    errorMessage.message +=  `${key} is not as per required data. `;
    return true;
  } else {
    return false;
  }
}

/**
 * checking variable for required
 *
 * @param validationConfig config of the variable for validation
 * @param toValidate a variable to validate
 * @param errorMessage an error message in case of error
 * @param key key of variable
 */
function checkRequired(validationConfig, toValidate, errorMessage: IError, key: string): boolean {

  if (validationConfig.required &&
    (toValidate === undefined || toValidate === null ||
      (typeof toValidate === 'string' && toValidate.trim() === '')
    )
  ) {
    console.debug(`checking for required`);
    errorMessage.message += `${key} is required. `;
    return true;
  } else {
    return false;
  }
}

/**
 * checking datatype of variable for string
 *
 * @param validationConfig config of the variable for validation
 * @param toValidate a variable to validate
 * @param errorMessage an error message in case of error
 * @param key key of variable
 */
function checkString(validationConfig, toValidate, errorMessage: IError, key: string): boolean {

  if (validationConfig.string && typeof toValidate !== 'string') {
    console.debug(`checking for string datatype`);
    errorMessage.message += `${key} is not as per defined datatype. `;
    return true;
  } else {
    return false;
  }
}

/**
 * checking datatype of variable for number
 *
 * @param validationConfig config of the variable for validation
 * @param toValidate a variable to validate
 * @param errorMessage an error message in case of error
 * @param key key of variable
 */
function checkNumber(validationConfig, toValidate, errorMessage: IError, key: string): boolean {

  if (validationConfig.number && isNaN(parseInt(toValidate, 10))) {
    console.debug(`checking for number datatype`);
    errorMessage.message += `${key} is not as per defined datatype. `;
    return true;
  } else {
    return false;
  }
}

/**
 * checking datatype of variable for object
 *
 * @param validationConfig config of the variable for validation
 * @param toValidate a variable to validate
 * @param errorMessage an error message in case of error
 * @param key key of variable
 */
function checkObject(validationConfig, toValidate, errorMessage: IError, key: string): boolean {

  if (validationConfig.isObject && typeof toValidate !== 'object') {
    console.debug(`checking for object datatype`);
    errorMessage.message += `${key} is not as per defined datatype. `;
    return true;
  } else {
    return false;
  }
}

/**
 * checking for custom validation on variable
 *
 * @param validationConfig config of the variable for validation
 * @param toValidate a variable to validate
 * @param errorMessage an error message in case of error
 */
function checkCustom(validationConfig, toValidate, errorMessage: IError): boolean {

  if (validationConfig.custom && !validationConfig.custom(toValidate, errorMessage)) {
    console.debug(`calling custom validation callback`);
    return true;
  } else {
    return false;
  }
}

export default (config) => (req: Request, res: Response, next: NextFunction) => {
  console.info('====== inside validation handler =======');
  console.debug(`req.body = ${req.body}`);
  console.debug('config = ', config);

  const errorMessages = [];
  const variableCounts = {
    body: 0,
    params: 0,
    query: 0
  };

  Object.keys(config).forEach((key) => {
    console.debug(`key = ${key}`);

    const errorMessage: IError = { code: '400', message: ''};
    const validationConfig = config[key];
    let isError = false;

    validateValidationConfig(validationConfig);

    validationConfig.in.forEach((element) => {

      console.debug(`element = ${element}`);
      console.debug(req[element]);

      let toValidate = req[element][key];

      console.debug(`tovalidate = ${toValidate}`);

      // assigning default value
      toValidate = req[element][key] = assignDefualtValue(validationConfig, toValidate);

      // checking for not required and not supplied variable
      if (!validationConfig.required && toValidate === undefined) {
        console.debug('inside return require');
        return;
      }

      // counting the safe variable
      variableCounts[element]++;

      isError = checkRequired(validationConfig, toValidate, errorMessage, key) || isError;
      if (isError) return;

      isError = checkString(validationConfig, toValidate, errorMessage, key) || isError;
      if (isError) return;

      isError = checkNumber(validationConfig, toValidate, errorMessage, key) || isError;
      if (isError) return;

      isError = checkObject(validationConfig, toValidate, errorMessage, key) || isError;
      if (isError) return;

      isError = checkRegex(validationConfig, toValidate, errorMessage, key) || isError;
      if (isError) return;

      isError = checkCustom(validationConfig, toValidate, errorMessage, key) || isError;
      if (isError) return;
    });

    // override config default error message
    if (validationConfig.errorMessage !== undefined) {
      errorMessage.message = validationConfig.errorMessage;
    }

    if (isError)
      console.debug(`Key = ${key}, error message = `, errorMessage);
      errorMessages.push(errorMessage);
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
    next(errorMessages);
  else
    next();
};
