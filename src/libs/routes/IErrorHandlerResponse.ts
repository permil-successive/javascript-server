import IResponse from './IResponse';

export default interface IErrorHandlerResponse extends IResponse {
  error: string;
}
