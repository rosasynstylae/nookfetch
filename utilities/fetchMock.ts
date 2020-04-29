import "whatwg-fetch";
declare let global: any;
declare let Response: any;

const fetchSpy = jest.fn(async url => {
  if (url === "/testing/123") {
    return new Response(JSON.stringify({ foo: "bar" }), {
      headers: { "Content-Type": "text/json" }
    });
  }
});

jest.spyOn(global, "fetch").mockImplementation(fetchSpy);

export default fetchSpy;