import audioSizes from "../../../_data/audio-sizes.json" with { type: "json" };

async function copyRange(body, writable, start, end) {
  const reader = body.getReader();
  const writer = writable.getWriter();
  let offset = 0;

  try {
    while (offset <= end) {
      const { done, value } = await reader.read();
      if (done) break;
      const nextOffset = offset + value.byteLength;
      if (nextOffset > start) {
        await writer.write(value.subarray(Math.max(0, start - offset), end + 1 - offset));
      }
      offset = nextOffset;
    }
    await writer.close();
  } catch (error) {
    await writer.abort(error).catch(() => {});
  } finally {
    await reader.cancel().catch(() => {});
  }
}

export async function onRequestGet(context) {
  const { request } = context;
  const range = /^bytes=(\d*)-(\d*)$/i.exec(request.headers.get("range") || "");
  if (!range || (!range[1] && !range[2])) return context.next();

  // Pages serves the full static asset, so slice its uncompressed byte stream here.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("range");
  requestHeaders.delete("if-range");
  requestHeaders.set("accept-encoding", "identity");
  const response = await context.next(new Request(request, { headers: requestHeaders }));
  // The internal asset response can omit Content-Length even when Pages sends it publicly.
  const total = Number(response.headers.get("content-length") ?? audioSizes[context.params.file]);
  const mediaType = response.headers.get("content-type") || "";
  const encoding = response.headers.get("content-encoding");
  if (response.status !== 200 || !response.body || !Number.isSafeInteger(total) || total < 1 ||
      !/^(audio\/|application\/octet-stream\b)/i.test(mediaType) || (encoding && encoding !== "identity")) {
    return response;
  }

  const validator = request.headers.get("if-range");
  if (validator && (validator.startsWith("W/") ||
      (validator !== response.headers.get("etag") && validator !== response.headers.get("last-modified")))) {
    return response;
  }

  const start = range[1] ? Number(range[1]) : Math.max(0, total - Number(range[2]));
  const end = range[1] && range[2] ? Math.min(Number(range[2]), total - 1) : total - 1;
  if (start > end) {
    context.waitUntil(response.body.cancel());
    return new Response(null, {
      status: 416,
      headers: { "accept-ranges": "bytes", "content-range": `bytes */${total}` }
    });
  }

  const length = end - start + 1;
  const headers = new Headers(response.headers);
  headers.set("accept-ranges", "bytes");
  headers.set("content-length", String(length));
  headers.set("content-range", `bytes ${start}-${end}/${total}`);
  const { readable, writable } = new FixedLengthStream(length);
  context.waitUntil(copyRange(response.body, writable, start, end));
  return new Response(readable, { status: 206, headers });
}
