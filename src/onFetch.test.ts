import fetchSpy from "@utils/fetchMock";

import onFetch from "./onFetch";

const validation = (data: any): { data: { foo: string }; errors: string[] } => {
  if (typeof data === "object") {
    if (typeof data.foo === "string") {
      return { data: { foo: data.foo }, errors: [] };
    }
    return {
      data: { foo: "" },
      errors: ["object does not have 'foo' as string"]
    };
  }

  return { data: { foo: "" }, errors: ["could not parse"] };
};

describe("onFetch", () => {
  beforeEach(jest.clearAllMocks);

  it("should fetch and validate data", async () => {
    const val = await onFetch(jest.fn())("/testing/123", validation);

    expect(val).toEqual({ data: { foo: "bar" }, errors: [] });
  });

  it("should pass correct args to fetch if no options", async () => {
    await onFetch(jest.fn())("/testing/123", validation);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenNthCalledWith(1, "/testing/123", {});
  });

  it("should pass correct args to fetch if options are passed", async () => {
    await onFetch(jest.fn())("/testing/123", validation, { method: "POST" });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenNthCalledWith(1, "/testing/123", {
      method: "POST"
    });
  });

  it("should pass correct args to fetch if body is passed", async () => {
    const body = { foo: "bar" };
    await onFetch(jest.fn())(
      "/testing/123",
      validation,
      { method: "POST" },
      body
    );

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenNthCalledWith(1, "/testing/123", {
      method: "POST",
      body: JSON.stringify(body)
    });
  });

  it("should pass correct args to fetch if formdata body is passed", async () => {
    const body = new FormData();
    body.append("username", "unicorns");
    await onFetch(jest.fn())(
      "/testing/123",
      validation,
      { method: "POST" },
      body
    );

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenNthCalledWith(1, "/testing/123", {
      method: "POST",
      body
    });
  });

  it("should use error handling by default", async () => {
    const onError = jest.fn();
    fetchSpy.mockImplementationOnce(() => {
      throw new Error("Rawr!");
    });

    try {
      await onFetch(onError)("/testing/123", validation);

      // fail if the fetch does not error
      expect(true).toBe(false);
    } catch (e) {
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenNthCalledWith(1, e);
    }
  });

  it("should ignore error handling if turned off", async () => {
    const onError = jest.fn();
    fetchSpy.mockImplementationOnce(() => {
      throw new Error("Rawr!");
    });

    try {
      await onFetch(onError)("/testing/123", validation, {
        useErrorHandling: false
      });

      // fail if the fetch does not error
      expect(true).toBe(false);
    } catch (e) {
      expect(onError).toHaveBeenCalledTimes(0);
    }
  });

  it("should use error handling if turned on", async () => {
    const onError = jest.fn();
    fetchSpy.mockImplementationOnce(() => {
      throw new Error("Rawr!");
    });

    try {
      await onFetch(onError)("/testing/123", validation, {
        useErrorHandling: true
      });

      // fail if the fetch does not error
      expect(true).toBe(false);
    } catch (e) {
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenNthCalledWith(1, e);
    }
  });
});
