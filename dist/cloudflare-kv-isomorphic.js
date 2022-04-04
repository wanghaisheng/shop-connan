"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function default_1(namespace) {
    if (typeof globalThis[namespace] !== "undefined")
        return globalThis[namespace];
    return globalThis[namespace] = new KV(namespace);
}
exports.default = default_1;
class KV {
    namespace;
    initiated = false;
    data;
    filename;
    constructor(namespace) {
        this.namespace = namespace;
    }
    async init() {
        if (this.initiated)
            return;
        this.filename = `./.kv-${encodeURIComponent(this.namespace)}.json`;
        const contents = await fs_1.default.promises.readFile(this.filename, { encoding: "utf8", flag: "as+" });
        this.data = JSON.parse(contents || "{}");
        const now = new Date().getTime() / 1000;
        Object.entries(this.data).forEach(([k, v]) => {
            if (v[1] != null && v[1] < now)
                this.delete(k);
        });
        this.initiated = true;
    }
    async put(key, value, options = {}) {
        await this.init();
        const now = Math.round(new Date().getTime() / 1000);
        let expiresAt;
        if (typeof options.expiration === "number") {
            if (options.expiration < now + 60) {
                return value;
            }
            expiresAt = options.expiration;
        }
        else if (typeof options.expirationTtl === "number") {
            if (options.expirationTtl < 60) {
                return value;
            }
            expiresAt = options.expirationTtl + now;
        }
        this.data[key] = [value, expiresAt];
        await fs_1.default.promises.writeFile(this.filename, JSON.stringify(this.data), { encoding: "utf8" });
        return value;
    }
    async get(key) {
        await this.init();
        return (this.data[key] || [])[0];
    }
    async delete(key) {
        await this.init();
        const value = delete this.data[key];
        await fs_1.default.promises.writeFile(this.filename, JSON.stringify(this.data), { encoding: "utf8" });
        return value;
    }
    async list(prefix = "", limit = 0, cursor) {
        await this.init();
        return { keys: Object.keys(this.data).filter(k => k.startsWith(prefix)).slice(0, limit + 1) };
    }
}
// import KV from "cloudflare-kv-isomorphic";
// const MY_NAMESPACE = KV("MY_NAMESPACE");
// await MY_NAMESPACE.put("key", "value");
// await MY_NAMESPACE.get("key");
// https://github.com/RaeesBhatti/cloudflare-kv-isomorphic
