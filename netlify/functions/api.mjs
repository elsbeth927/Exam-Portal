const upstreamBase = "https://uxbzfirtxpwpbhlsusmf.supabase.co/functions/v1/exam-api";

export default async function(req) {
  try {
    const u = new URL(req.url);
    let p = u.pathname.replace("/.netlify/functions/api", "");
    if (!p.startsWith("/")) p = "/" + p;

    const headers = new Headers();
    const cookie = req.headers.get("cookie");
    const csrf = req.headers.get("x-csrf-token");
    const ct = req.headers.get("content-type");
    if (cookie) headers.set("cookie", cookie);
    if (csrf) headers.set("x-csrf-token", csrf);
    if (ct) headers.set("content-type", ct);

    const init = { method: req.method, headers };
    if (req.method !== "GET" && req.method !== "HEAD") {
      init.body = await req.text();
    }

    const r = await fetch(upstreamBase + p + u.search, init);
    const body = await r.text();
    const out = new Headers({"content-type": r.headers.get("content-type") || "application/json","cache-control":"no-store"});
    const setCookie = r.headers.get("set-cookie");
    if (setCookie) out.set("set-cookie", setCookie);
    return new Response(body, {status:r.status, headers:out});
  } catch {
    return new Response(JSON.stringify({error:"API proxy error."}), {status:502, headers:{"content-type":"application/json"}});
  }
}