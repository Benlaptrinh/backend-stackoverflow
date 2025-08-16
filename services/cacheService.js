// services/cacheService.js
const { redis } = require('../utils/redis');

const cacheService = {
    async get(key) {
        const value = await redis.get(key);
        return value ? JSON.parse(value) : null;
    },

    async set(key, data, ttl = 60) {
        // node-redis v4: dùng options object
        await redis.set(key, JSON.stringify(data), { EX: ttl });
    },

    async del(key) {
        await redis.del(key);
    }
};

module.exports = cacheService;
