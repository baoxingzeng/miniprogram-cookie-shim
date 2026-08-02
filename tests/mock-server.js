import fs from "fs";
import cors from "cors";
import express from "express";

const app = express();
app.use(cors());

app.get("/ping", (req, res) => { res.send("pong"); });

app.get("/api/cookie/set", (req, res) => {
    const { name, value } = req.query;
    res.cookie(String(name), String(value));
    res.cookie("sessionId", "abc123xyz456", { httpOnly: true, secure: false });
    res.cookie("theme", "dark", { maxAge: 3000 });
    res.json({
        code: 0,
        message: "Cookies set",
        data: { name, value }
    });
});

app.get("/api/cookie/echo", (req, res) => {
    const cookieHeader = req.headers.cookie || '';
    const cookies = {};
    cookieHeader.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        const name = parts.shift()?.trim() || '';
        const value = parts.join('=').trim();
        if (name) {
            cookies[name] = decodeURIComponent(value);
        }
    });
    res.json({
        code: 0,
        cookies,
        cookieHeader
    });
});

app.get("/api/cookie/clear", (req, res) => {
    res.clearCookie("sessionId");
    res.clearCookie("theme");
    res.json({
        code: 0,
        message: "Cookies cleared"
    });
});

const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`Mock server started: http://localhost:${PORT}`);
});

export default server;
