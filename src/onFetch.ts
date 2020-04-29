import { getBody } from "./helpers";

type Options = Omit<RequestInit, "body"> & { useErrorHandling?: boolean };

/**
 * Fetch wrapper factory
 *
 * Please note that this function assumes that the API returns json-serialized
 * data. Currently it does not handle other types of data.
 *
 * @param onError - callback function on api error
 *
 * @return the onFetch function
 */
const createOnFetch = (
  onError: (e: Error) => void
): (<T>(
  url: string,
  // we can accept any here because this is validating the input
  validate: (input: any) => T, // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: Options,
  data?: object | FormData
) => Promise<T>) => {
  /**
   * Fetch wrapper function
   *
   * Please note that this function assumes that the API returns json-serialized
   * data. Currently it does not handle other types of data.
   *
   * @param url - the url to call
   * @param validate - function to validate the return from the fetch
   * @param options - the configuration options for the fetch call
   * @param data - data to send in the body
   *
   * @return the validated data
   */
  const onFetch = async <T>(
    url: string,
    // we can accept any here because this is validating the input
    validate: (input: any) => T, // eslint-disable-line @typescript-eslint/no-explicit-any
    options?: Options,
    data?: object | FormData
  ): Promise<T> => {
    const { useErrorHandling = true, ...fetchOptions } = options || {};

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

  return onFetch;
};

export default createOnFetch;
