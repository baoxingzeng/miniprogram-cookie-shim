# miniprogram-cookie-shim

> [miniprogram-xmlhttprequest-shim](https://www.npmjs.com/package/miniprogram-xmlhttprequest-shim) 的 Cookie 插件，像 `document.cookie` 一样读写，可单独使用。

**[English](https://github.com/baoxingzeng/miniprogram-cookie-shim/blob/main/README.en.md)**

## 安装

```bash
npm install miniprogram-cookie-shim
```

## 快速开始

```javascript
import { Cookie, setBaseURL, createAccessor } from "miniprogram-cookie-shim";

const accessor = createAccessor("https://api.example.com");

// 读写 Cookie
Cookie.set("token=abc123; Max-Age=3600; Path=/");
console.log(Cookie.get()); // "token=abc123"

// 请求时注入 Cookie，响应后保存 Set-Cookie
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

> **注意**：各小程序平台的 API 存在差异，示例中的 `wx.request` 仅用于示意。实际使用时，请根据你所使用的平台文档进行调整，请求方法名、参数格式、响应字段等都可能有所不同。

## API

### `Cookie`

`Cookie.get()` 和 `Cookie.set()` 在小程序与浏览器中都能正常工作：

- **在小程序中**：通过内置 Cookie 存储模拟浏览器行为。
- **在浏览器中**：直接读写 `document.cookie`，与原生行为一致。

| 方法                       | 说明                                                                |
| -------------------------- | ------------------------------------------------------------------- |
| `Cookie.get()`             | 返回当前域名可用的所有 Cookie（格式：`name=value; ...`）            |
| `Cookie.set(cookieString)` | 写入一个 Cookie，支持 `Max-Age`、`Expires`、`Path`、`Domain` 等属性 |

### `createAccessor(baseURL?)`

创建 Cookie 访问器。适用于需要在 `wx.request`、`my.request` 等网络请求中手动管理 Cookie 的场景。

| 参数      | 类型      | 说明                                     |
| --------- | --------- | ---------------------------------------- |
| `baseURL` | `string?` | 可选，同时调用 `setBaseURL` 设置基准 URL |

返回对象：

| 方法  | 签名                                                                             | 说明                              |
| ----- | -------------------------------------------------------------------------------- | --------------------------------- |
| `get` | `(url: string, withCredentials?: boolean) => string`                             | 根据 URL 返回匹配的 Cookie 字符串 |
| `set` | `(url: string, withCredentials?: boolean, cookies?: string \| string[]) => void` | 根据 URL 将响应的 Cookie 写入存储 |

> `withCredentials` 为 `true` 时，允许跨域请求携带 Cookie；同源请求不受此参数影响。

### `setBaseURL(url)`

设置全局基准 URL，用于 Cookie 的域匹配和路径匹配，可多次调用。

| 参数  | 类型     | 说明              |
| ----- | -------- | ----------------- |
| `url` | `string` | 有效的 URL 字符串 |

## 开源协议

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
