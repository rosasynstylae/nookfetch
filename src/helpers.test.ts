import "whatwg-fetch";
import { getBody, parseReturnData } from "./helpers";

declare let Response: any;

describe("getBody", () => {
  it("should return the data if it's FormData", () => {
    const formData = new FormData();
    formData.append("username", "Groucho");

    const data = getBody(formData);
    expect(data).toBe(formData);
  });

  it("should stringify the data if it's an object", () => {
    const data = getBody({ foo: "unicorns", bar: "peas" });
    expect(data).toBe('{"foo":"unicorns","bar":"peas"}');
  });
});

describe("parseReturnData", () => {
  it("should parse data if the type is JSON", async () => {
    const returnBody = { foo: "bar" };
    const response = new Response(JSON.stringify(returnBody), {
      headers: { "Content-Type": "application/json" }
    });

    const value = await parseReturnData(response);
    expect(value).toEqual(returnBody);
  });

  it("should not try to parse the data if the type is not JSON", async () => {
    const formData = new FormData();
    formData.append("foo", "bar");

    const response = new Response(formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    const value = await parseReturnData(response);

    expect(value).toBe(response);
  });

  it("should not parse data if there is no header", async () => {
    const returnBody = { foo: "bar" };
    const response = new Response(JSON.stringify(returnBody));

    const value = await parseReturnData(response);

    expect(value).toBe(response);
  });
});
