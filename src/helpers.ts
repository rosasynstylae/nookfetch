/**
 * Creates a body from passed data
 *
 * @param data - the data to process
 *
 * @return the body to pass to fetch
 */
const getBody = (data: object | FormData): string | FormData => {
  if (data instanceof FormData) {
    return data;
  }

  return JSON.stringify(data);
};

export { getBody };
