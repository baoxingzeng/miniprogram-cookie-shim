# miniprogram-cookie-shim

> A Cookie plugin for [miniprogram-xmlhttprequest-shim](https://www.npmjs.com/package/miniprogram-xmlhttprequest-shim). Read and write cookies in mini programs just like `document.cookie`. Can also be used standalone.

## Installation

```bash
npm install miniprogram-cookie-shim
```

## Quick Start

```javascript
import { Cookie, setBaseURL, wrap } from "miniprogram-cookie-shim";

setBaseURL("https://api.example.com"); // Set base URL for cookie domain matching

// Read and write cookies — same semantics as document.cookie getter/setter
Cookie.set("token=abc123; Max-Age=3600; Path=/");
console.log(Cookie.get()); // "token=abc123"

// request is just an example, replace with your platform's actual method
// e.g., WeChat uses wx.request, Alipay uses my.request, etc.
// wrap() automatically sends cookies with requests and stores Set-Cookie from responses
request(wrap({
    url: "https://api.example.com/user",
    withCredentials: true, // enable for cross-origin requests
    success(res) {
        console.log(res.data);
    },
}));
```

## API

### `Cookie`

`Cookie.get()` and `Cookie.set()` work in both mini programs and browsers:

- **In mini programs**: Simulates browser behavior via built-in cookie storage.
- **In browsers**: Reads and writes `document.cookie` directly, identical to native behavior.

| Method                     | Description                                                              |
| -------------------------- | ------------------------------------------------------------------------ |
| `Cookie.get()`             | Returns all cookies for the current domain (`name=value; ...`)           |
| `Cookie.set(cookieString)` | Sets a cookie. Supports `Max-Age`, `Expires`, `Path`, `Domain`, and more |

### `setBaseURL(url)`

Sets the global base URL used for cookie domain and path matching. Can be called multiple times.

| Parameter | Type     | Description        |
| --------- | -------- | ------------------ |
| `url`     | `string` | A valid URL string |

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
