function getObj(element, callback) {
  const obj = {};
  const parameters = element.split(':');
  if (callback !== undefined)
    obj[parameters[0]] = callback(parameters[1]);
  else
    obj[parameters[0]] = parameters[1];
  return obj;
}

/**
 * convert string query parameters to obj
 * @param searchQuery query parameters in string
 */
export default function parseStringQuery(searchQuery: string, callback) {
  let search = {};
  if (Array.isArray(searchQuery)) {
    searchQuery.forEach((element: string) => {
      search = {...getObj(element, callback)};
    });
  } else if (searchQuery) {
    search = {...getObj(searchQuery, callback)};
  }
  return search;
}
