import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import assert from "node:assert/strict";
const exec = promisify(execFile);
const name = `portfolio-likes-test-${process.pid}-${Date.now()}`;
function sql(text) {
  return new Promise((resolve, reject) => {
    const child = spawn("docker", [
      "exec",
      "-i",
      name,
      "psql",
      "-U",
      "postgres",
      "-d",
      "postgres",
      "-v",
      "ON_ERROR_STOP=1",
      "-qAt",
    ]);
    let out = "",
      err = "";
    child.stdout.on("data", (data) => (out += data));
    child.stderr.on("data", (data) => (err += data));
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve(out.trim()) : reject(new Error(err.trim())),
    );
    child.stdin.end(text);
  });
}
const a = "00000000-0000-0000-0000-000000000001",
  b = "00000000-0000-0000-0000-000000000002";
const as = (role, user, query) =>
  sql(`set role ${role}; set request.jwt.claim.sub='${user || ""}'; ${query}`);
const vote = async (user, liked) =>
  JSON.parse(
    await as(
      "authenticated",
      user,
      `select public.set_portfolio_like(${liked});`,
    ),
  );
try {
  await exec("docker", [
    "run",
    "--rm",
    "-d",
    "--network",
    "none",
    "--name",
    name,
    "-e",
    "POSTGRES_HOST_AUTH_METHOD=trust",
    "postgres:17-alpine",
  ]);
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try {
      await exec("docker", ["exec", name, "pg_isready", "-U", "postgres"]);
      ready = true;
      break;
    } catch {
      await delay(250);
    }
  }
  assert(ready, "PostgreSQL did not start");
  // Stand-ins only for Supabase-provided roles/auth schema. The migration itself is real PostgreSQL SQL.
  await sql(`create role anon; create role authenticated; create schema auth;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth to anon, authenticated;
    insert into auth.users values('${a}'),('${b}');`);
  await sql(
    await readFile(
      new URL(
        "../supabase/migrations/202611130001_portfolio_likes.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  assert.deepEqual(
    JSON.parse(await as("anon", null, "select public.portfolio_like_state();")),
    { count: 0, liked: false },
  );
  await assert.rejects(
    as("anon", null, "select * from public.portfolio_likes;"),
    /permission denied/,
  );
  await assert.rejects(
    as("anon", null, "select public.set_portfolio_like(true);"),
    /permission denied/,
  );
  await assert.rejects(vote(null, true), /Authentication required/);
  await assert.rejects(vote(a, "null"), /Like state required/);
  assert.deepEqual(await vote(a, true), { count: 1, liked: true });
  assert.deepEqual(await vote(a, true), { count: 1, liked: true });
  assert.deepEqual(await vote(b, true), { count: 2, liked: true });
  assert.deepEqual(await vote(a, false), { count: 1, liked: false });
  assert.deepEqual(await vote(a, false), { count: 1, liked: false });
  await assert.rejects(
    as(
      "authenticated",
      a,
      `delete from public.portfolio_likes where user_id='${b}';`,
    ),
    /permission denied/,
  );
  await Promise.all(Array.from({ length: 5 }, () => vote(a, true)));
  assert.deepEqual(
    JSON.parse(
      await as("authenticated", b, "select public.portfolio_like_state();"),
    ),
    { count: 2, liked: true },
  );
  assert.deepEqual(
    JSON.parse(await as("anon", null, "select public.portfolio_like_state();")),
    { count: 2, liked: false },
  );
  console.log(
    "PostgreSQL checks passed: shared aggregate, private rows, authenticated identity, idempotent likes/unlikes and concurrent retries.",
  );
} finally {
  await exec("docker", ["stop", name]).catch(() => {});
}
