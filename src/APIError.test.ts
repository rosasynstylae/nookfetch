import APIError from "./APIError";

describe("APIError", () => {
  it("should set data correctly on creation", () => {
    const error = new APIError("API Error", 500);

    expect(error.message).toBe("API Error");
    expect(error._status).toBe(500);
  });

  it("should set name correctly", () => {
    expect(APIError.name).toBe("APIError");
  });

  describe("getStatus", () => {
    it("should correctly get the status", () => {
      const error = new APIError("API Error", 304);

      expect(error.getStatus()).toBe(error._status);
    });
  });
});
