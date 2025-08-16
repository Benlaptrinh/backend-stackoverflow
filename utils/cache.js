// utils/cache.js
const { redis } = require('./redis');

async function cacheGetOrSet(key, ttlSec, loader, { lockSec = 5 } = {}) {
    const hit = await redis.get(key);
    if (hit) return JSON.parse(hit);

    const lockKey = `${key}:lock`;
    const locked = await redis.set(lockKey, '1', { NX: true, EX: lockSec });
    if (!locked) {
        await new Promise(r => setTimeout(r, 50));
        const again = await redis.get(key);
        if (again) return JSON.parse(again);
    }

    const value = await loader();
    await redis.set(key, JSON.stringify(value), { EX: ttlSec });
    await redis.del(lockKey);
    return value;
}

module.exports = { cacheGetOrSet };
