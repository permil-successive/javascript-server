export default interface IConfig {
  port: string;
  env: string;
  secretKey: string;
  mongoUri: string;
  password: string;
  saltRounds: number;
}
