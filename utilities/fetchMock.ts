import "whatwg-fetch";
declare let global: any;
declare let Response: any;

const fetchSpy = jest.fn(async url => {
  if (url === "/testing/123") {
    return new Response(JSON.stringify({ foo: "bar" }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  if (url === "/test/empty") {
    return new Response(null, {
      status: 204
    });
  }

  if (url === "/test/error") {
    return new Response(JSON.stringify({ message: "It broke!" }), {
      status: 500
    });
  }
});

jest.spyOn(global, "fetch").mockImplementation(fetchSpy);

export default fetchSpy;
