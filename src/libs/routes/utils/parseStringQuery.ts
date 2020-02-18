function getObj(element) {
  const obj = {};
  const parameters = element.split(':');
  obj[parameters[0]] = parameters[1];
  return obj;
}

/**
 * convert string query parameters to obj
 * @param searchQuery query parameters in string
 */
export default function parseStringQuery(searchQuery: string) {
  let search = {};
  if (Array.isArray(searchQuery)) {
    searchQuery.forEach((element: string) => {
      search = {...getObj(element)};
    });
  } else if (searchQuery) {
    search = {...getObj(searchQuery)};
  }
  return search;
}
