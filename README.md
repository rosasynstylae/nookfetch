# nookfetch

A lightweight, flexible fetch wrapper written during the 2020 quarantine

## Table of Contents

- [Installation](#Installation)
- [Documentation](#Documentation)
- [TODO](#TODO)

## Installation

```shell
npm i nookfetch --save
```

## Documentation

### createNookFetch

nookFetch factory - creates the [`nookFetch`](#nookFetch-function) function and binds it to error handling.

#### Arguments

| Name          | Type                  | Required | Default         | Description                                                   |
| ------------- | --------------------- | -------- | --------------- | ------------------------------------------------------------- |
| onError       | (e: Error) => void    | true     | -               | callback function on error - could be API or validation error |
| parseResponse | (e: Response) => void | -        | parseReturnData | general function to parse incoming data                       |

**NOTE:** The default parseResponse value will ONLY parse JSON data - it will return the Response object if the header is not `application/json`.

#### Returns

An [`nookFetch`](#nookFetch-function) function that is bound to the onError function.

#### Usage

```typescript
import createNookFetch from "nookfetch";

const onError = (e: Error) => {
  // some generic error handling here
  ...
};

const nookFetch = createNookFetch(onError);

export default nookFetch;
```

## nookFetch Function

Fetch wrapper function

This function handles parsing, validation, and error handling for a fetch.

#### Arguments

| Name         | Type              | Required | Default                                   | Description                                         |
| ------------ | ----------------- | -------- | ----------------------------------------- | --------------------------------------------------- |
| url          | string            | true     | -                                         | the url to call                                     |
| validate     | (input: any) => T | true     | -                                         | function to validate the return data from the fetch |
| fetchOptions | FetchOptionsType  | -        | -                                         | configuration options for the fetch call            |
| options      | OptionsType       | -        | See `OptionsType` for default information | configuration options                               |

##### FetchOptionsType

The FetchOptionsType in typescript is as follows:

```typescript
type FetchOptionsType = Omit<RequestInit, "body"> & {
  body?: object | FormData;
};
```

You can pass any options available to the fetch function.

The body type has been changed - nookFetch will process it automatically into a type the fetch function can consume.

##### OptionsType

The OptionsType is an object with the following properties:

| Name             | Type                  | Required | Default         | Description                                               |
| ---------------- | --------------------- | -------- | --------------- | --------------------------------------------------------- |
| useErrorHandling | boolean               | -        | true            | toggles use of the onError function                       |
| parseResponse    | (e: Response) => void | -        | parseReturnData | function to parse incoming data for a specific fetch call |

**NOTE:** The default parseResponse value will ONLY parse JSON data - it will return the Response object if the header is not `application/json`.

#### Returns

A promise that resolves to the output of the validation function.

#### Throws

##### API Error

- Could be parsing error
- Could be error raised by fetch

##### Validation Error

- Error thrown by validate function

#### Usage

```typescript
import nookFetch from "file/with/createNookFetch";
import validate from "validation";

try {
  const info = nookFetch(
    "/testing/123",
    validate,
    {
      method: "POST",
      body: { foo: "bar" }
    },
    { useErrorHandling: true }
  );
} catch (e) {
  console.log("ERROR!!!!", e);
}
```

## TODO

- Create custom API error class
