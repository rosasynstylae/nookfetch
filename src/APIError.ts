/**
 * Class representing an API Error
 */
class APIError extends Error {
  _status: number = Number.NaN;
  name = "APIError";

  /**
   * Create an APIError
   *
   * @param message message from the API
   * @param status the API status code
   */
  constructor(message: string, status: number) {
    super(message);

    this._status = status;
  }

  /**
   * Get the status code
   * @return the status code
   */
  getStatus = (): number => this._status;
}

export default APIError;
