# miniprogram-cookie-shim

> A Cookie plugin for [miniprogram-xmlhttprequest-shim](https://www.npmjs.com/package/miniprogram-xmlhttprequest-shim). Read and write cookies in mini programs just like `document.cookie`. Can also be used standalone.

## Installation

```bash
npm install miniprogram-cookie-shim
```

## Quick Start

```javascript
import { Cookie, createAccessor } from "miniprogram-cookie-shim";

const accessor = createAccessor("https://api.example.com");

// Read and write cookies
Cookie.set("token=abc123; Max-Age=3600; Path=/");
console.log(Cookie.get()); // "token=abc123"

// Inject cookies into requests, save Set-Cookie on response
wx.request({
    url: "https://api.example.com/user",
    header: {
        Cookie: accessor.get("https://api.example.com/user", true),
    },
    success(res) {
        accessor.set("https://api.example.com/user", true, res.cookies || res.header["set-cookie"]);
    },
});
```

> **Note**: Mini program APIs vary across platforms. The `wx.request` above is for illustration only. Consult your platform's documentation for the actual request method name, parameter format, and response fields.

## API

### `Cookie`

`Cookie.get()` and `Cookie.set()` work in both mini programs and browsers:

- **In mini programs**: Simulates browser behavior via built-in cookie storage.
- **In browsers**: Reads and writes `document.cookie` directly, identical to native behavior.

| Method                     | Description                                                              |
| -------------------------- | ------------------------------------------------------------------------ |
| `Cookie.get()`             | Returns all cookies for the current domain (`name=value; ...`)           |
| `Cookie.set(cookieString)` | Sets a cookie. Supports `Max-Age`, `Expires`, `Path`, `Domain`, and more |

### `createAccessor(baseURL?)`

Creates a cookie accessor for manually managing cookies in network requests (`wx.request`, `my.request`, etc.).

| Parameter | Type      | Description                                      |
| --------- | --------- | ------------------------------------------------ |
| `baseURL` | `string?` | Optional. Also calls `setBaseURL` under the hood |

Returns:

| Method | Signature                                                                        | Description                                        |
| ------ | -------------------------------------------------------------------------------- | -------------------------------------------------- |
| `get`  | `(url: string, withCredentials?: boolean) => string`                             | Returns matching cookies for the given URL         |
| `set`  | `(url: string, withCredentials?: boolean, cookies?: string \| string[]) => void` | Persists response cookies based on the request URL |

> When `withCredentials` is `true`, cross-origin cookies are allowed; same-origin requests are unaffected by this parameter.

### `setBaseURL(url)`

Sets the global base URL used for cookie domain and path matching. Can be called multiple times.

| Parameter | Type     | Description        |
| --------- | -------- | ------------------ |
| `url`     | `string` | A valid URL string |

## License

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
