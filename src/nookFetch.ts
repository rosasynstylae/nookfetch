import { getBody, parseReturnData } from "./helpers";

type FetchOptionsType = Omit<RequestInit, "body"> & {
  body?: object | FormData;
};

interface OptionsType {
  /** if set to false, the onError function will not be called - default: true */
  useErrorHandling?: boolean;
  // we can use any here because this is parsing the response - not checking type
  /* eslint-disable @typescript-eslint/no-explicit-any */
  /** parse function for this specific call */
  parseResponse?: (response: Response) => Promise<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

/**
 * nookFetch factory
 *
 * @param onError callback function on api error
 * @param parseResponse general function to parse incoming data
 *
 * @note parsing will default using a built-in parser that ONLY handles JSON
 *       data if neither parseResponse is set
 *
 * @return the nookFetch function
 */
const createNookFetch = (
  onError: (e: Error) => void,
  // we can use any here because this is parsing the response - not checking type
  /* eslint-disable @typescript-eslint/no-explicit-any */
  parseResponse?: (response: Response) => Promise<any>
  /* eslint-enable @typescript-eslint/no-explicit-any */
): (<T>(
  url: string,
  // we can accept any here because this is validating the input
  validate: (input: any) => T, // eslint-disable-line @typescript-eslint/no-explicit-any
  fetchOptions?: FetchOptionsType,
  options?: OptionsType
) => Promise<T>) => {
  const parse = parseResponse || parseReturnData;

  /**
   * Fetch wrapper function
   *
   * This function handles parsing, validation, and error handling for a
   * fetch.
   *
   * @param url - the url to call
   * @param validate - function to validate the return from the fetch
   * @param fetchOptions - configuration options for the fetch call
   * @param options - configuration options
   *
   * @throws either api or validation error
   *
   * @return the validated data
   */
  const nookFetch = async <T>(
    url: string,
    // we can accept any here because this is validating the input
    validate: (input: any) => T, // eslint-disable-line @typescript-eslint/no-explicit-any
    fetchOptions?: FetchOptionsType,
    options?: OptionsType
  ): Promise<T> => {
    const { useErrorHandling = true, parseResponse: parseResponseData } =
      options || {};
    const { body: data } = fetchOptions || {};

    const parseData = parseResponseData || parse;

    try {
      const body = data ? getBody(data) : undefined;

      const returnVal = await fetch(url, { ...fetchOptions, body });
      const value = await parseData(returnVal);

      return validate(value);
    } catch (e) {
      if (useErrorHandling) {
        onError(e);
      }

      throw e;
    }
  };

  return nookFetch;
};

export default createNookFetch;
