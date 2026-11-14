// Deterministic provider-contract fixture. Actual SQL is checked separately in PostgreSQL.
export function likesService() {
  const votes = new Set(),
    access = new Map(),
    refresh = new Map();
  let next = 0,
    token = 0,
    fail = false;
  const session = (id) => {
    const access_token = `test-access-${++token}`,
      refresh_token = `test-refresh-${token}`;
    access.set(access_token, id);
    refresh.set(refresh_token, id);
    return { access_token, refresh_token, expires_in: 3600 };
  };
  return {
    failNextWrite() {
      fail = true;
    },
    get signups() {
      return next;
    },
    handle(path, headers, body) {
      if (!headers.apikey)
        return { status: 401, json: { error: "Missing key" } };
      if (path === "/auth/v1/signup")
        return { status: 200, json: session(++next) };
      if (path === "/auth/v1/token?grant_type=refresh_token") {
        const id = refresh.get(body.refresh_token);
        return id
          ? { status: 200, json: session(id) }
          : { status: 400, json: { error: "Invalid refresh token" } };
      }
      const id = access.get(
        (headers.authorization || "").replace("Bearer ", ""),
      );
      if (path === "/rest/v1/rpc/set_portfolio_like") {
        if (fail) {
          fail = false;
          return { status: 503, json: { error: "Unavailable" } };
        }
        if (!id)
          return { status: 401, json: { error: "Authentication required" } };
        if (body.p_liked) votes.add(id);
        else votes.delete(id);
      } else if (path !== "/rest/v1/rpc/portfolio_like_state")
        return { status: 404, json: { error: "Unknown endpoint" } };
      return { status: 200, json: { count: votes.size, liked: votes.has(id) } };
    },
  };
}
