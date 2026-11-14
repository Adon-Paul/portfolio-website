// @vitest-environment node
import { createServer } from "node:http";
import { afterEach, beforeEach, expect, it } from "vitest";
import { likesService } from "../../tests/helpers/likes-service";
import { createLikesClient } from "./client";
let server, service, url;
const storage = () => {
  const map = new Map();
  return {
    getItem: (key) => map.get(key),
    setItem: (key, value) => map.set(key, value),
    removeItem: (key) => map.delete(key),
    map,
  };
};
beforeEach(async () => {
  service = likesService();
  server = createServer(async (request, response) => {
    let raw = "";
    for await (const chunk of request) raw += chunk;
    const result = service.handle(
      request.url,
      request.headers,
      JSON.parse(raw || "{}"),
    );
    response.writeHead(result.status, { "Content-Type": "application/json" });
    response.end(JSON.stringify(result.json));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  url = `http://127.0.0.1:${server.address().port}`;
});
afterEach(async () => {
  await new Promise((resolve) => server.close(resolve));
});
const client = (store) =>
  createLikesClient(
    { url, publishableKey: "sb_publishable_test" },
    { storage: store },
  );
it("shares the authoritative count across independent visitors and writes idempotent state", async () => {
  const a = client(storage()),
    b = client(storage());
  expect(await a.read()).toEqual({ count: 0, liked: false });
  expect(service.signups).toBe(0);
  expect(await a.setLiked(true)).toEqual({ count: 1, liked: true });
  expect(await a.setLiked(true)).toEqual({ count: 1, liked: true });
  expect(await b.read()).toEqual({ count: 1, liked: false });
  expect(await b.setLiked(true)).toEqual({ count: 2, liked: true });
  expect(await a.read()).toEqual({ count: 2, liked: true });
  expect(await a.setLiked(false)).toEqual({ count: 1, liked: false });
  expect(await b.read()).toEqual({ count: 1, liked: true });
});
it("refreshes an existing identity instead of adding another vote", async () => {
  const store = storage();
  const a = client(store);
  await a.setLiked(true);
  const key = [...store.map.keys()][0];
  const saved = JSON.parse(store.getItem(key));
  saved.expires_at = 0;
  store.setItem(key, JSON.stringify(saved));
  const restored = client(store);
  expect(await restored.read()).toEqual({ count: 1, liked: true });
  expect(service.signups).toBe(1);
});
it("fails writes honestly and never accepts secret configuration", async () => {
  const a = client(storage());
  await a.read();
  service.failNextWrite();
  await expect(a.setLiked(true)).rejects.toThrow("Likes service unavailable");
  expect(await a.read()).toEqual({ count: 0, liked: false });
  expect(() =>
    createLikesClient({ url, publishableKey: "sb_secret_private" }),
  ).toThrow("public project key");
});

it("keeps one shared identity during a visit when browser storage is blocked", async () => {
  const blocked = {
    getItem() {
      throw new Error("Blocked");
    },
    setItem() {
      throw new Error("Blocked");
    },
  };
  const a = client(blocked);
  expect(await a.setLiked(true)).toEqual({ count: 1, liked: true });
  expect(await a.setLiked(false)).toEqual({ count: 0, liked: false });
  expect(service.signups).toBe(1);
});
it("rejects malformed server counts instead of showing them as totals", async () => {
  const a = createLikesClient(
    { url, publishableKey: "sb_publishable_test" },
    {
      storage: storage(),
      fetcher: async () =>
        new Response(JSON.stringify({ count: -1, liked: false }), {
          status: 200,
        }),
    },
  );
  await expect(a.read()).rejects.toThrow("Invalid likes response");
});
