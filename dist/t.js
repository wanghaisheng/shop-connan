"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kv_1 = __importDefault(require("@adaptivelink/kv"));
const NAMESPACE = new kv_1.default("namespace");
const handleRequest = async (event) => {
    const keyValue = await NAMESPACE.get("key");
    event.waitUntil(await NAMESPACE.put("hello", "world"));
};
// https://github.com/adaptive/kv
