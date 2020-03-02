export default interface IList {
  skip?: number;
  limit?: number;
  projection?: string;
  sort?: string;
  search?: ISearch;
  exclude?: object;
}

export interface ISearch {
  name?: string;
  email?: string;
}
