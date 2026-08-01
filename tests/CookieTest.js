import { suite } from "uvu";
import * as assert from "uvu/assert";
import { getPlatform } from "miniprogram-platform";
import { ui_rec, testConfig } from "./utils.js";
import { Cookie, setBaseURL, wrap } from "./exports.js";

const _name = "Cookie";
export const _test = suite(_name);

/**
 * @param {string} n
 * @param {Parameters<typeof _test>[1]} t
 */
const test = (n, t) => {
    return _test(...ui_rec(_name, n, t));
}

const platform = getPlatform();
const mp = { request: platform.mp.request };
export function setRequestFunc(request) { mp.request = request; }

setBaseURL(testConfig.api_prefix);

test("Cookie support: set and echo cookies with withCredentials", async () => {
    let status1 = 0;
    await (new Promise(resolve => {
        mp.request(wrap({
            url: testConfig.api_prefix + "/api/cookie/set?name=testKey&value=testValue",
            withCredentials: true,
            success(res) {
                status1 = res.statusCode || res.status;
                resolve();
            },
        }));
    }));
    assert.equal(status1, 200);

    let status2 = 0;
    let data = { cookies: {} };
    await (new Promise(resolve => {
        mp.request(wrap({
            url: testConfig.api_prefix + "/api/cookie/echo",
            withCredentials: true,
            success(res) {
                status2 = res.statusCode || res.status;
                data = res.data;
                resolve();
            },
        }));
    }));
    assert.equal(status2, 200);
    assert.equal(data.cookies.testKey, "testValue");
    assert.equal(data.cookies.sessionId, "abc123xyz456");
    assert.equal(data.cookies.theme, "dark");
});

test("Cookie support: same-origin cookies still sent when withCredentials is false", async () => {
    let status = 0;
    let data = { cookies: {} };
    await (new Promise(resolve => {
        mp.request(wrap({
            url: testConfig.api_prefix + "/api/cookie/echo",
            withCredentials: false,
            success(res) {
                status = res.statusCode || res.status;
                data = res.data;
                resolve();
            },
        }));
    }));
    assert.equal(status, 200);
    assert.equal(data.cookies.testKey, "testValue");
    assert.ok(Object.keys(data.cookies).length >= 1);
});

test("Cookie support: clear cookies works correctly", async () => {
    let status1 = 0;
    await (new Promise(resolve => {
        mp.request(wrap({
            url: testConfig.api_prefix + "/api/cookie/clear",
            withCredentials: true,
            success(res) {
                status1 = res.statusCode || res.status;
                resolve();
            },
        }));
    }));
    assert.equal(status1, 200);

    let status2 = 0;
    let data = { cookies: {} };
    await (new Promise(resolve => {
        mp.request(wrap({
            url: testConfig.api_prefix + "/api/cookie/echo",
            withCredentials: true,
            success(res) {
                status2 = res.statusCode || res.status;
                data = res.data;
                resolve();
            },
        }));
    }));
    assert.equal(status2, 200);
    assert.equal(data.cookies.testKey, "testValue");
    assert.equal(data.cookies.sessionId, undefined);
    assert.equal(data.cookies.theme, undefined);
});

test("document.cookie API: Cookie.get() returns all cookies in same format", async () => {
    const cookieStr = Cookie.get();
    assert.equal(typeof cookieStr, "string");
    assert.ok(cookieStr.includes("testKey=testValue"));
});

test("document.cookie API: Cookie.set() can set a new cookie", async () => {
    Cookie.set("customCookie=myCustomValue; Max-Age=3600; Path=/");
    const cookieStr = Cookie.get();
    assert.ok(cookieStr.includes("customCookie=myCustomValue"));

    let status = 0;
    let data = { cookies: {} };
    await (new Promise(resolve => {
        mp.request(wrap({
            url: testConfig.api_prefix + "/api/cookie/echo",
            withCredentials: true,
            success(res) {
                status = res.statusCode || res.status;
                data = res.data;
                resolve();
            },
        }));
    }));
    assert.equal(status, 200);
    assert.equal(data.cookies.customCookie, "myCustomValue");
});

test("document.cookie API: Cookie.set() can overwrite an existing cookie", async () => {
    Cookie.set("customCookie=updatedValue");
    const cookieStr = Cookie.get();
    assert.ok(cookieStr.includes("customCookie=updatedValue"));

    let status = 0;
    let data = { cookies: {} };
    await (new Promise(resolve => {
        mp.request(wrap({
            url: testConfig.api_prefix + "/api/cookie/echo",
            withCredentials: true,
            success(res) {
                status = res.statusCode || res.status;
                data = res.data;
                resolve();
            },
        }));
    }));
    assert.equal(status, 200);
    assert.equal(data.cookies.customCookie, "updatedValue");
});

test("document.cookie API: expired cookies are automatically removed", async () => {
    const pastDate = new Date(0).toUTCString();
    Cookie.set(`expiredCookie=shouldBeGone; expires=${pastDate}`);
    const cookieStr = Cookie.get();
    assert.ok(!cookieStr.includes("expiredCookie"));
});
