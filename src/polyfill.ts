export * from "./index";
import { Cookie } from "./Cookie";

/* eslint-disable no-prototype-builtins */
const g: typeof globalThis =
    (typeof globalThis !== "undefined" && globalThis) ||
    (typeof window !== "undefined" && window) ||
    (typeof self !== "undefined" && self) ||
    // @ts-ignore eslint-disable-next-line no-undef
    (typeof global !== "undefined" && global) ||
    {};

if (g.document && typeof g.document === "object" && !("cookie" in g.document)) {
    Object.defineProperty(g.document, "cookie", {
        configurable: true,
        enumerable: true,
        get: Cookie.get,
        set: Cookie.set,
    });
}
