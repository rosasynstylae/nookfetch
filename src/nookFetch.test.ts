import fetchSpy from "@utils/fetchMock";

jest.mock("./helpers", () => {
  const { getBody, parseReturnData } = jest.requireActual("./helpers");
  return {
    getBody,
    parseReturnData: jest.fn().mockImplementation(parseReturnData)
  };
});

import { parseReturnData } from "./helpers";
import createNookFetch from "./nookFetch";

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

describe("createNookFetch", () => {
  beforeEach(jest.clearAllMocks);

  it("should fetch and validate data", async () => {
    const nookFetch = createNookFetch(jest.fn());
    const val = await nookFetch("/testing/123", validation);

    expect(val).toEqual({ data: { foo: "bar" }, errors: [] });
  });

  it("should pass correct args to fetch if no options", async () => {
    const nookFetch = createNookFetch(jest.fn());
    await nookFetch("/testing/123", validation);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenNthCalledWith(1, "/testing/123", {});
  });

  it("should pass correct args to fetch if options are passed", async () => {
    const nookFetch = createNookFetch(jest.fn());
    await nookFetch("/testing/123", validation, {
      method: "POST"
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenNthCalledWith(1, "/testing/123", {
      method: "POST"
    });
  });

  it("should pass correct args to fetch if body is passed", async () => {
    const body = { foo: "bar" };

    const nookFetch = createNookFetch(jest.fn());
    await nookFetch("/testing/123", validation, {
      method: "POST",
      body
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenNthCalledWith(1, "/testing/123", {
      method: "POST",
      body: JSON.stringify(body)
    });
  });

  it("should pass correct args to fetch if formdata body is passed", async () => {
    const body = new FormData();
    body.append("username", "unicorns");

    const nookFetch = createNookFetch(jest.fn());
    await nookFetch("/testing/123", validation, {
      method: "POST",
      body
    });

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
      const nookFetch = createNookFetch(onError);
      await nookFetch("/testing/123", validation);

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
      const nookFetch = createNookFetch(onError);
      await nookFetch("/testing/123", validation, undefined, {
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
      const nookFetch = createNookFetch(onError);
      await nookFetch("/testing/123", validation, undefined, {
        useErrorHandling: true
      });

      // fail if the fetch does not error
      expect(true).toBe(false);
    } catch (e) {
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenNthCalledWith(1, e);
    }
  });

  it("should use default parser if no parser is passed", async () => {
    const nookFetch = createNookFetch(jest.fn());

    await nookFetch(
      "/test/empty",
      jest.fn(a => a)
    );

    expect(parseReturnData).toHaveBeenCalledTimes(1);
  });

  it("should use general parser if no specific parser is passed", async () => {
    const generalParser = jest.fn(val => val);
    const nookFetch = createNookFetch(jest.fn(), generalParser);

    await nookFetch(
      "/test/empty",
      jest.fn(a => a)
    );

    expect(parseReturnData).toHaveBeenCalledTimes(0);
    expect(generalParser).toHaveBeenCalledTimes(1);
  });

  it("should use specific parser if passed", async () => {
    const specificParser = jest.fn(val => val);
    const nookFetch = createNookFetch(jest.fn());

    await nookFetch(
      "/test/empty",
      jest.fn(a => a),
      undefined,
      {
        parseResponse: specificParser
      }
    );

    expect(parseReturnData).toHaveBeenCalledTimes(0);
    expect(specificParser).toHaveBeenCalledTimes(1);
  });

  it("should use specific parser even if a general parser is passed", async () => {
    const generalParser = jest.fn(val => val);
    const specificParser = jest.fn(val => val);

    const nookFetch = createNookFetch(jest.fn(), generalParser);

    await nookFetch(
      "/test/empty",
      jest.fn(a => a),
      undefined,
      {
        parseResponse: specificParser
      }
    );

    expect(parseReturnData).toHaveBeenCalledTimes(0);
    expect(generalParser).toHaveBeenCalledTimes(0);
    expect(specificParser).toHaveBeenCalledTimes(1);
  });
});
