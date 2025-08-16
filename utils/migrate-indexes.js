// scripts/migrate-indexes.js
require('dotenv').config();
const mongoose = require('mongoose');

async function main() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/backend_stackoverflow';
    // LƯU Ý:
    // - TRONG docker-compose: MONGODB_URI= mongodb://root:root@mongo:27017/backend_stackoverflow?authSource=admin
    // - NGOÀI docker:       mongodb://root:root@localhost:27017/backend_stackoverflow?authSource=admin
    //   (host 'mongo' chỉ resolve trong mạng Docker)

    await mongoose.connect(uri, {});

    // Load models để Mongoose nạp schema & index
    require('../models/Question');
    require('../models/Answer');
    try { require('../models/Vote'); } catch { }

    await Promise.all(
        Object.values(mongoose.models).map(m => m.syncIndexes())
    );

    console.log('✅ syncIndexes done');
    await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
