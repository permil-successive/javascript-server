import { Request, Response, NextFunction } from 'express';
import IError from './IError';

function checkRegex(toValidate: string, regex: RegExp, errorMessage, key): boolean {

  if (regex && regex.test(toValidate)) {
    console.debug(`checking for regex`);
    errorMessage.message +=  `${key} is not as per required data. `;
    return true;
  } else {
    return false;
  }
}

function checkRequired(validationConfig, toValidate, errorMessage, key): boolean {

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

function checkString(validationConfig, toValidate, errorMessage, key): boolean {

  if (validationConfig.string && typeof toValidate !== 'string') {
    console.debug(`checking for string datatype`);
    errorMessage.message += `${key} is not as per defined datatype. `;
    return true;
  } else {
    return false;
  }
}

function checkNumber(validationConfig, toValidate, errorMessage, key): boolean {

  if (validationConfig.number && isNaN(parseInt(toValidate, 10))) {
    console.debug(`checking for number datatype`);
    errorMessage.message += `${key} is not as per defined datatype. `;
    return true;
  } else {
    return false;
  }
}

function checkObject(validationConfig, toValidate, errorMessage, key): boolean {

  if (validationConfig.isObject && typeof toValidate !== 'object') {
    console.debug(`checking for object datatype`);
    errorMessage.message += `${key} is not as per defined datatype. `;
    return true;
  } else {
    return false;
  }
}

function checkCustom(validationConfig, toValidate, errorMessage, key): boolean {

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

    const errorMessage: IError = { code: '', message: ''};
    const validationConfig = config[key];
    validationConfig.required = validationConfig.required === undefined ? true : validationConfig.required;
    validationConfig.in = validationConfig.in || [ 'body' ];
    let isError = false;

    const ValidationInSet = [ 'body', 'params', 'query' ];
    validationConfig.in.forEach((element) => {
      if (ValidationInSet.indexOf(element) === -1)
        throw { message: 'only use thse elements ("body", "params", "query") "in" key', code: 500};
    });

    validationConfig.in.forEach((element) => {

      console.debug(`element = ${element}`);
      console.debug(req[element]);

      let toValidate = req[element][key];
      errorMessage.code = '401';

      console.debug(`tovalidate = ${toValidate}`);

      // assigning default value
      if (validationConfig.default && !toValidate) {
        toValidate = req[element][key] = validationConfig.default;
      }

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

    // override config error message
    if (validationConfig.errorMessage !== undefined) {
      errorMessage.message = validationConfig.errorMessage;
    }

    if (isError)
      console.debug('current error message = ', errorMessage);
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
