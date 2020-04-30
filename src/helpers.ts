/**
 * Creates a body from passed data
 *
 * @param data the data to process
 *
 * @return the processed body to pass to fetch
 */
const getBody = (data: object | FormData): string | FormData => {
  if (data instanceof FormData) {
    return data;
  }

  return JSON.stringify(data);
};

// we can use any here because this is parsing the response - not checking type
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Gets data from api
 *
 * @param value the response object to get data from
 *
 * @return the processed data
 */
const parseReturnData = async (value: Response): Promise<any> => {
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const type = value.headers.get("Content-Type");
  if (type === "application/json") {
    return await value.json();
  }

  return value;
};

export { getBody, parseReturnData };
