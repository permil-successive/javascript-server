export default interface IList {
  skip?: number;
  limit?: number;
  sort?: string;
  exclude?: object;
}

export interface ISearch {
  name?: string;
  email?: string;
}
