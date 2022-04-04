import KV from "@adaptivelink/kv";

const NAMESPACE = new KV("namespace");

const handleRequest = async (event) => {
  const keyValue = await NAMESPACE.get("key");
  event.waitUntil(await NAMESPACE.put("hello", "world"));
};


// https://github.com/adaptive/kv