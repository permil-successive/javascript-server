import { Request, Response, NextFunction } from 'express';
import IError from './IError';

function checkRegex(stringToValidate: string, regex: RegExp): boolean {
  return regex.test(stringToValidate);
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

      // check for required
      if (validationConfig.required &&
        (toValidate === undefined || toValidate === null ||
          (typeof toValidate === 'string' && toValidate.trim() === '')
        )
      ) {
        console.debug(`checking for required`);
        errorMessage.message += `${key} is required. `;
        isError = true;
      }

      // checking for string datatype
      if (validationConfig.string && typeof toValidate !== 'string') {
        console.debug(`checking for string datatype`);
        errorMessage.message += `${key} is not as per defined datatype. `;
        isError = true;
      }

      // checking for number datatype
      if (validationConfig.number && isNaN(parseInt(toValidate, 10))) {
        console.debug(`checking for number datatype`);
        errorMessage.message += `${key} is not as per defined datatype. `;
        isError = true;
      }

      // checking for object datatype
      if (validationConfig.isObject && typeof toValidate !== 'object') {
        console.debug(`checking for object datatype`);
        errorMessage.message += `${key} is not as per defined datatype. `;
        isError = true;
      }

      // checking for regex
      if (validationConfig.regex && !checkRegex(toValidate, validationConfig.regex)) {
        console.debug(`checking for regex`);
        errorMessage.message +=  `${key} is not as per required data. `;
        isError = true;
      }

      // calling custom validation (callback)
      if (validationConfig.custom && !validationConfig.custom(toValidate, errorMessage)) {
        console.debug(`calling custom validation callback`);
        isError = true;
      }

      if (validationConfig.errorMessage !== undefined) {
        errorMessage.message = validationConfig.errorMessage;
      }

      // counting the safe variable
      variableCounts[element]++;

      console.debug('current error message = ', errorMessage);
    });
    if (isError)
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
