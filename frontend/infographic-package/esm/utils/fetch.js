import flru from 'flru';
const nativeFetch = globalThis.fetch;
const CACHE_MAX_ENTRIES = 1024;
const responseCache = flru(CACHE_MAX_ENTRIES);
const pendingRequests = new Map();
function buildHeadersKey(request) {
    const entries = Array.from(request.headers.entries());
    if (entries.length === 0)
        return '';
    entries.sort(([nameA], [nameB]) => nameA.toLowerCase().localeCompare(nameB.toLowerCase()));
    return entries
        .map(([name, value]) => `${name.toLowerCase()}:${value}`)
        .join('|');
}
function buildCacheKey(request) {
    const headersKey = buildHeadersKey(request);
    return headersKey
        ? `${request.method}:${request.url}:${headersKey}`
        : `${request.method}:${request.url}`;
}
function buildResponse(entry) {
    return new Response(entry.body.slice(0), entry.init);
}
async function fetchAndCache(request, key) {
    try {
        const response = await nativeFetch(request);
        const body = await response.arrayBuffer();
        const entry = {
            body,
            init: {
                status: response.status,
                statusText: response.statusText,
                headers: Array.from(response.headers.entries()),
            },
        };
        if (response.ok) {
            responseCache.set(key, entry);
        }
        return entry;
    }
    finally {
        pendingRequests.delete(key);
    }
}
export async function fetchWithCache(input, init) {
    const request = new Request(input, init);
    if (request.method !== 'GET') {
        return nativeFetch(request);
    }
    const key = buildCacheKey(request);
    if (responseCache.has(key)) {
        return buildResponse(responseCache.get(key));
    }
    let pending = pendingRequests.get(key);
    if (!pending) {
        pending = fetchAndCache(request, key);
        pendingRequests.set(key, pending);
    }
    const entry = await pending;
    return buildResponse(entry);
}
