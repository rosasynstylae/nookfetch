import { getBody } from "./helpers";

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
