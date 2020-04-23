import { getBody } from "./helpers";

type Options = Omit<RequestInit, "body">;

/**
 * Fetch wrapper function
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
  validate: (input: any) => T,
  options?: Options,
  data?: object | FormData
): Promise<T> => {
  const body = data ? getBody(data) : undefined;

  const returnVal = await fetch(url, { ...(options || {}), body });
  const value = await returnVal.json();

  return validate(value);
};

export default onFetch;
