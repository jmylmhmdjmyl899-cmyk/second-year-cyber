import { getStore } from "@netlify/blobs";

const store = () => getStore({ name: "cyber-stage2-data", consistency: "strong" });

export default async (request) => {
  try {
    const db = store();

    if (request.method === "GET") {
      const data = await db.get("site-data", { type: "json", consistency: "strong" });
      return Response.json({ ok: true, data: data ?? null });
    }

    if (request.method === "PUT") {
      const body = await request.json();
      if (!body || typeof body !== "object") {
        return Response.json({ ok: false, error: "Invalid data" }, { status: 400 });
      }
      await db.setJSON("site-data", body);
      return Response.json({ ok: true, saved: true });
    }

    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "GET, PUT" },
    });
  } catch (error) {
    console.error("data function error", error);
    return Response.json({ ok: false, error: "Server storage error" }, { status: 500 });
  }
};

export const config = {
  path: "/api/data",
};
