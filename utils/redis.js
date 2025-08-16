// utils/redis.js
const { createClient } = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = createClient({ url: REDIS_URL });

redis.on('error', (err) => console.error('[redis] error', err));

async function initRedis() {
    if (!redis.isOpen) {
        await redis.connect();
        console.log('[redis] connected', REDIS_URL);
    }
}

module.exports = { redis, initRedis };
