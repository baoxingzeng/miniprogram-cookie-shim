import { createAccessor } from "./Cookie";

interface IRequestOptions {
    url: string;
    header?: object;
    headers?: object;
    enableCookie?: boolean;
    withCredentials?: boolean;
    success?: Function;
    fail?: Function;
}

const accessor = /*#__PURE__*/createAccessor();
export function wrap<T extends IRequestOptions>(options: T): T {
    if (!(options && typeof options === "object")) return options;

    let headers = (options.header || options.headers || {}) as Record<string, string>;
    if (typeof headers !== "object") { headers = {}; }

    let hasCookie = false;
    let names = Object.getOwnPropertyNames(headers);

    for (let i = 0; i < names.length; ++i) {
        let name = names[i]!;
        if (name.toLowerCase() === "cookie") {
            hasCookie = true;
            break;
        }
    }

    const url = typeof options.url === "string" ? options.url : "";
    const withCredentials = !!options.withCredentials;

    function isNotExists(key: keyof IRequestOptions) {
        return !(key in options) || options[key] === null || options[key] === undefined;
    }

    if (!hasCookie && (isNotExists("enableCookie") ? true : options.enableCookie)) {
        let cookie = accessor.get(url, withCredentials);
        if (cookie) {
            headers["Cookie"] = cookie;
            if (isNotExists("header")) { options.header = headers; }
            if (isNotExists("headers")) { options.headers = headers; }
            if (isNotExists("enableCookie")) { options.enableCookie = true; }
        }
    }

    function requestSuccess(res: { header?: object; headers?: object; cookies?: string[] }) {
        if (!(res && typeof res === "object")) return;

        let headers = (res.header || res.headers || {}) as Record<string, string>;
        if (typeof headers !== "object") { headers = {}; }

        const names = Object.getOwnPropertyNames(headers);
        const getSetCookie = function () {
            for (let i = 0; i < names.length; ++i) {
                let name = names[i]!;
                if (name.toLowerCase() === "set-cookie") {
                    return headers[name];
                }
            }
        }

        let cookies = ("cookies" in res && Array.isArray(res.cookies)) ? res.cookies : (getSetCookie() || "");
        if (cookies.length > 0) {
            accessor.set(url, withCredentials, cookies);
        }
    }

    function requestFail(err: any) {
        if (!(err && typeof err === "object")) return;
        if (("header" in err && "statusCode" in err) || ("headers" in err && "status" in err)) {
            requestSuccess({
                header: "header" in err ? err.header : err.headers || {},
            });
        }
    }

    if (!isNotExists("success")) {
        const _success = options.success!;
        options.success = function (res: { header?: object }) {
            requestSuccess(res);
            if (typeof _success === "function") { _success.call(options, res); }
        }
    } else {
        options.success = requestSuccess;
    }

    if (!isNotExists("fail")) {
        const _fail = options.fail!;
        options.fail = function (err: any) {
            requestFail(err);
            if (typeof _fail === "function") { _fail.call(options, err); }
        }
    } else {
        options.fail = requestFail;
    }

    return options; // side effect: mutates the original options, though kept as intact as possible.
}
