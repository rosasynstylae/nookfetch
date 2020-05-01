# nookfetch

A lightweight, flexible fetch wrapper written during the 2020 quarantine

![Build](https://github.com/rosasynstylae/nookfetch/workflows/Run%20CI/badge.svg)

## Table of Contents

- [Installation](#Installation)
- [Documentation](#Documentation)
  - [createNookFetch](#createNookFetch)
  - [nookFetch](#nookFetch-function)
  - [APIError](#APIError)

## Installation

```shell
npm i nookfetch --save
```

## Documentation

### createNookFetch

nookFetch factory - creates the [`nookFetch`](#nookFetch-function) function and binds it to error handling.

#### Arguments

| Name           | Type               | Required | Default                                        | Description                                                   |
| -------------- | ------------------ | -------- | ---------------------------------------------- | ------------------------------------------------------------- |
| onError        | (e: Error) => void | true     | -                                              | callback function on error - could be API or validation error |
| generalOptions | ParseOptionsType   | -        | See `ParseOptionsType` for default information | general settings for fetch functions                          |

##### ParseOptionsType

The ParseOptionsType is an object with the following properties:

| Name               | Type                  | Required | Default         | Description                                               |
| ------------------ | --------------------- | -------- | --------------- | --------------------------------------------------------- |
| parseResponse      | (e: Response) => void | -        | parseReturnData | function to parse incoming data for a specific fetch call |
| parseErrorResponse | boolean               | -        | -               | function to parse error message for this specific call    |

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

**NOTE:** The body type has been changed - nookFetch will process it automatically into a type the fetch function can consume.

##### OptionsType

The OptionsType is an object with the following properties:

| Name               | Type                  | Required | Default                                           | Description                                                       |
| ------------------ | --------------------- | -------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| useErrorHandling   | boolean               | -        | true                                              | toggles use of the onError function                               |
| parseResponse      | (e: Response) => void | -        | `parseReturnData` OR the general parsing function | function to parse incoming data for a specific fetch call, if set |
| parseErrorResponse | boolean               | -        | the general error parsing function, if set        | function to parse error message for this specific call            |

**NOTE:** The default parseResponse value will ONLY parse JSON data - it will return the Response object if the header is not `application/json`.

#### Returns

A promise that resolves to the output of the validation function.

#### Throws

##### API Error

- Error thrown by fetch
- Error thrown when api status is not in the 200 range

##### Validation Error

- Error thrown by validate function

##### Parsing Error

- Error thrown by the parsing function

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

### APIError

Class representing an API Error

#### Arguments

| Name    | Type   | Required | Default | Description         |
| ------- | ------ | -------- | ------- | ------------------- |
| message | string | true     | -       | the error message   |
| status  | number | true     | -       | the api status code |

#### Functions

##### getStatus

Function to get the status code of the API error.

###### Returns

Number that represents the API error code.
