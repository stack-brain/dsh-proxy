import type http from 'node:http';
/**
 * Attach the buffered "decompress → transform(plain) → recompress → send" pipeline
 * to `res`, from the `proxyRes` event of http-proxy. The rewrite changes the body
 * length, so `content-length` is always dropped and the body is sent chunked.
 *
 * `transform(plainBuffer)` returns the rewritten Buffer, or null when no rewrite
 * is needed (pass the original bytes through unwrapped).
 *
 * Degradation guarantees (the response is never corrupted):
 * - upstream compressed but decompression fails / encoding unsupported → pass the
 *   compressed bytes through, keeping the upstream Content-Encoding value;
 * - rewrite succeeded but recompression fails → send plain text and drop the
 *   Content-Encoding header so the browser reads it as plain;
 * - uncompressed (identity) → rewrite directly with no compression overhead.
 *
 * @param res    - the outbound server response to intercept.
 * @param proxyRes - the upstream response being streamed through.
 * @param transform - plain-buffer → rewritten-buffer (or null to passthrough).
 */
export declare function attachBodyTransform(res: http.ServerResponse, proxyRes: http.IncomingMessage, transform: (plain: Buffer) => Buffer | null): void;
