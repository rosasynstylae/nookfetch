import { getBody } from "./helpers";

type FetchOptionsType = Omit<RequestInit, "body"> & {
  body?: object | FormData;
};

interface OptionsType {
  /** if set to false, the onError function will not be called - default: true */
  useErrorHandling?: boolean;
}

/**
 * nookFetch factory
 *
 * @param onError - callback function on api error
 *
 * @return the nookFetch function
 */
const createNookFetch = (
  onError: (e: Error) => void
): (<T>(
  url: string,
  // we can accept any here because this is validating the input
  validate: (input: any) => T, // eslint-disable-line @typescript-eslint/no-explicit-any
  fetchOptions?: FetchOptionsType,
  options?: OptionsType
) => Promise<T>) => {
  /**
   * Fetch wrapper function
   *
   * This function handles parsing, validation, and error handling for a
   * fetch.
   *
   * Please note that this function assumes that the API returns json-serialized
   * data. Currently it does not handle other types of data.
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
    const { useErrorHandling = true } = options || {};
    const { body: data } = fetchOptions || {};

    try {
      const body = data ? getBody(data) : undefined;

      const returnVal = await fetch(url, { ...fetchOptions, body });
      const value = await returnVal.json();

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
