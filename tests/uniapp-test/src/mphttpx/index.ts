// @ts-nocheck
import { _test as Cookie_suite, setRequestFunc } from "../../../CookieTest.js";

setRequestFunc(uni.request);
Cookie_suite.run();
