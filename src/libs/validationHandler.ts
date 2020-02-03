import { Request, Response, NextFunction } from 'express';
import IError from './IError';

function checkRegex(stringToValidate: string, regex: RegExp): boolean {
  return regex.test(stringToValidate);
}

export default (config) => (req: Request, res: Response, next: NextFunction) => {
  console.info('====== inside validation handler =======');
  console.debug(`req.body = ${req.body}`);
  console.log(config);
  const errorMessages = [];
  Object.keys(config).forEach((key) => {
    console.debug(`key = ${key}`);

    const errorMessage: IError = { code: '', message: ''};
    const validationConfig = config[key];
    validationConfig.required = validationConfig.required === undefined ? true : validationConfig.required;
    validationConfig.in = validationConfig.in || [ 'body' ];
    let isError = false;

    validationConfig.in.forEach((element) => {

      console.debug(`element = ${element}`);

      let toValidate = req[element][key];
      errorMessage.code = '401';

      console.debug(req[element]);
      console.debug(`tovalidate = ${toValidate}`);

      // assigning default value
      if (validationConfig.default && !toValidate) {
        toValidate = req[element][key] = validationConfig.default;
      }

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
        console.info(`checking for required`);
        errorMessage.message += `${key} is required. `;
        isError = true;
      }

      // checking for string datatype
      if (validationConfig.string && typeof toValidate !== 'string') {
        console.info(`checking for string datatype`);
        errorMessage.message += `${key} is not as per defined datatype. `;
        isError = true;
      }

      // checking for number datatype
      if (validationConfig.number && isNaN(parseInt(toValidate, 10))) {
        console.info(`checking for number datatype`);
        errorMessage.message += `${key} is not as per defined datatype. `;
        isError = true;
      }

      // checking for object datatype
      if (validationConfig.isObject && typeof toValidate !== 'object') {
        console.info(`checking for object datatype`);
        errorMessage.message += `${key} is not as per defined datatype. `;
        isError = true;
      }

      // checking for regex
      if (validationConfig.regex && !checkRegex(toValidate, validationConfig.regex)) {
        console.info(`checking for regex`);
        errorMessage.message +=  `${key} is not as per required data. `;
        isError = true;
      }

      // calling custom validation (callback)
      if (validationConfig.custom && !validationConfig.custom(toValidate, errorMessage)) {
        console.info(`calling custom validation callback`);
        isError = true;
      }

      if (validationConfig.errorMessage !== undefined) {
        errorMessage.message = validationConfig.errorMessage;
      }

      console.log(errorMessage);
    });
    if (isError)
      errorMessages.push(errorMessage);
  });
  if (errorMessages.length > 0)
    next(errorMessages);
  else
    next();
};
