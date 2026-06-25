const cache = new Map();

export function getCachedData(key) {
  const item = cache.get(key);
  if (item && item.expiry > Date.now()) {
    return item.data;
  }
  return null;
}

export function setCachedData(key, data, ttlSeconds = 60) {
  cache.set(key, {
    data,
    expiry: Date.now() + ttlSeconds * 1000
  });
}
