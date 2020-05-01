import { getBody, parseReturnData } from "./helpers";
import APIError from "./APIError";

type FetchOptionsType = Omit<RequestInit, "body"> & {
  body?: object | FormData;
};

interface ParseOptionsType {
  // we can use any here because this is parsing the response - not checking type
  /* eslint-disable @typescript-eslint/no-explicit-any */
  /** parse function for this specific call */
  parseResponse?: (response: Response) => Promise<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  /** parse error message for this specific call */
  parseErrorResponse?: (respone: Response) => Promise<string>;
}

interface OptionsType extends ParseOptionsType {
  /** if set to false, the onError function will not be called - default: true */
  useErrorHandling?: boolean;
}

/**
 * nookFetch factory
 *
 * @param onError callback function on api error
 * @param generalOptions general settings for the fetch
 *
 * @note parsing will default using a built-in parser that ONLY handles JSON
 *       data if neither parseResponse is set
 * @note error message parsing will NOT be done if a parseErrorResponse function
 *       is not passed
 *
 * @return the nookFetch function
 */
const createNookFetch = (
  onError: (e: Error) => void,
  generalOptions?: ParseOptionsType
): (<T>(
  url: string,
  // we can accept any here because this is validating the input
  validate: (input: any) => T, // eslint-disable-line @typescript-eslint/no-explicit-any
  fetchOptions?: FetchOptionsType,
  options?: OptionsType
) => Promise<T>) => {
  const { parseResponse: parse = parseReturnData, parseErrorResponse } =
    generalOptions || {};

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
   * @throws api, parsing, or validation errors
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
    const {
      useErrorHandling = true,
      parseResponse: parseResponseData = parse,
      parseErrorResponse: parseErrorMessage = parseErrorResponse
    } = options || {};
    const { body: data } = fetchOptions || {};

    try {
      const body = data ? getBody(data) : undefined;

      const returnVal = await fetch(url, { ...fetchOptions, body });

      if (returnVal.status > 299 || returnVal.status < 200) {
        const errorMessage = parseErrorMessage
          ? await parseErrorMessage(returnVal)
          : "API Error";
        throw new APIError(errorMessage, returnVal.status);
      }

      const value = await parseResponseData(returnVal);

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
