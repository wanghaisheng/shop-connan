"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRequest = void 0;
const itty_router_1 = require("itty-router");
const itty_router_extras_1 = require("itty-router-extras");
const router = (0, itty_router_1.Router)();
router.get("/v8/artifacts/:id", async (request, env) => {
    if (!request.params?.id)
        return (0, itty_router_extras_1.error)(400, `Can't lookup an artifact without an id`);
    const existingArtifact = await env.ARTIFACTS.get(request.params.id, {
        type: "stream",
    });
    if (!existingArtifact) {
        return (0, itty_router_extras_1.missing)("Cache miss");
    }
    return new Response(existingArtifact);
});
async function saveArtifact(request, env) {
    const { ARTIFACTS } = env;
    if (!request.params?.id)
        return (0, itty_router_extras_1.error)(400, `Can't store an artifact without an id`);
    // Store the ReadableStream as a value :exploding_head:
    await ARTIFACTS.put(request.params.id, request.body);
    return (0, itty_router_extras_1.json)({ status: "success", message: "Artifact stored" });
}
router.post("/v8/artifacts/:id", saveArtifact);
router.put("/v8/artifacts/:id", saveArtifact);
router.all("*", () => (0, itty_router_extras_1.missing)("Not found"));
exports.handleRequest = router.handle;
exports.default = { fetch: exports.handleRequest };
