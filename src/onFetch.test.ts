import "whatwg-fetch";
declare let global: any;
declare let Response: any;

jest.spyOn(global, "fetch").mockImplementation(
  jest.fn(async url => {
    // const actualFetch = jest.requireActual("fetch");
    if (url === "/testing/123") {
      return new Response(JSON.stringify({ foo: "bar" }), {
        headers: { "Content-Type": "text/json" }
      });
    }
  })
);

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
  it("should fetch and validate data", async () => {
    const val = await onFetch("/testing/123", validation);

    expect(val).toEqual({ data: { foo: "bar" }, errors: [] });
  });
});
