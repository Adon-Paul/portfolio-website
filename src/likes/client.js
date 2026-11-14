export function createLikesClient(config, { fetcher = fetch, storage } = {}) {
  const url = new URL(config.url);
  if (
    url.protocol !== "https:" &&
    !(url.protocol === "http:" && url.hostname === "127.0.0.1")
  )
    throw new Error("Invalid likes endpoint");
  const key = config.publishableKey;
  let publicKey = typeof key === "string" && key.startsWith("sb_publishable_");
  if (!publicKey && typeof key === "string") {
    try {
      publicKey =
        JSON.parse(
          atob(key.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
        ).role === "anon";
    } catch {
      /* Reject secret or invalid keys. */
    }
  }
  if (!publicKey) throw new Error("A public project key is required");
  const base = url.origin;
  const sessionKey = `adon-likes-session:${url.host}`;
  if (storage === undefined) {
    try {
      storage = window.localStorage;
    } catch {
      storage = null;
    }
  }
  const load = () => {
    try {
      const value = JSON.parse(storage?.getItem(sessionKey) || "null");
      return value &&
        typeof value.access_token === "string" &&
        typeof value.refresh_token === "string" &&
        Number.isFinite(value.expires_at)
        ? value
        : null;
    } catch {
      return null;
    }
  };
  let session = load();
  let authenticating = null;
  const save = (value) => {
    if (value) {
      const expires = value.expires_at ?? Date.now() / 1000 + value.expires_in;
      if (
        typeof value.access_token !== "string" ||
        typeof value.refresh_token !== "string" ||
        !Number.isFinite(expires)
      )
        throw new Error("Invalid visitor session");
      value = {
        access_token: value.access_token,
        refresh_token: value.refresh_token,
        expires_at: expires,
      };
    }
    session = value;
    try {
      if (value) storage?.setItem(sessionKey, JSON.stringify(value));
      else storage?.removeItem(sessionKey);
    } catch {
      /* Keep the identity in memory for this visit. */
    }
  };
  async function request(path, body, token) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetcher(`${base}${path}`, {
        method: "POST",
        credentials: "omit",
        cache: "no-store",
        signal: controller.signal,
        headers: {
          apikey: key,
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const error = new Error("Likes service unavailable");
        error.status = response.status;
        throw error;
      }
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }
  async function authenticate(create) {
    session = load() || session;
    if (session?.expires_at > Date.now() / 1000 + 30) return session;
    if (session) {
      try {
        save(
          await request("/auth/v1/token?grant_type=refresh_token", {
            refresh_token: session.refresh_token,
          }),
        );
      } catch (error) {
        if (error.status !== 400 && error.status !== 401) throw error;
        save(null);
      }
    }
    if (!session && create)
      save(await request("/auth/v1/signup", { data: {} }));
    if (
      session &&
      (!session.access_token ||
        !session.refresh_token ||
        !Number.isFinite(session.expires_at))
    ) {
      save(null);
      throw new Error("Invalid visitor session");
    }
    return session;
  }
  async function identity(create) {
    if (authenticating) await authenticating;
    authenticating = authenticate(create);
    try {
      return await authenticating;
    } finally {
      authenticating = null;
    }
  }
  const state = (value) => {
    if (
      !Number.isSafeInteger(value?.count) ||
      value.count < 0 ||
      typeof value.liked !== "boolean"
    )
      throw new Error("Invalid likes response");
    return { count: value.count, liked: value.liked };
  };
  return {
    async read() {
      const visitor = await identity(false);
      try {
        return state(
          await request(
            "/rest/v1/rpc/portfolio_like_state",
            {},
            visitor?.access_token,
          ),
        );
      } catch (error) {
        if (error.status !== 401 || !visitor) throw error;
        save({ ...visitor, expires_at: 0 });
        const refreshed = await identity(false);
        return state(
          await request(
            "/rest/v1/rpc/portfolio_like_state",
            {},
            refreshed?.access_token,
          ),
        );
      }
    },
    async setLiked(liked) {
      if (typeof liked !== "boolean") throw new Error("Invalid like state");
      const visitor = await identity(true);
      try {
        return state(
          await request(
            "/rest/v1/rpc/set_portfolio_like",
            { p_liked: liked },
            visitor.access_token,
          ),
        );
      } catch (error) {
        if (error.status !== 401) throw error;
        save({ ...visitor, expires_at: 0 });
        const refreshed = await identity(true);
        return state(
          await request(
            "/rest/v1/rpc/set_portfolio_like",
            { p_liked: liked },
            refreshed.access_token,
          ),
        );
      }
    },
  };
}
