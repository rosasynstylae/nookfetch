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
    const val = await onFetch("/testing/123", validation);

    expect(val).toEqual({ data: { foo: "bar" }, errors: [] });
  });

  it("should pass correct args to fetch if no options", async () => {
    await onFetch("/testing/123", validation);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenNthCalledWith(1, "/testing/123", {});
  });

  it("should pass correct args to fetch if options are passed", async () => {
    await onFetch("/testing/123", validation, { method: "POST" });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenNthCalledWith(1, "/testing/123", {
      method: "POST"
    });
  });

  it("should pass correct args to fetch if body is passed", async () => {
    const body = { foo: "bar" };
    await onFetch("/testing/123", validation, { method: "POST" }, body);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenNthCalledWith(1, "/testing/123", {
      method: "POST",
      body: JSON.stringify(body)
    });
  });

  it("should pass correct args to fetch if formdata body is passed", async () => {
    const body = new FormData();
    body.append("username", "unicorns");
    await onFetch("/testing/123", validation, { method: "POST" }, body);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenNthCalledWith(1, "/testing/123", {
      method: "POST",
      body
    });
  });
});
