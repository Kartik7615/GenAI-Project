const mongoose = require('mongoose');

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function connectToDB() {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('Connected to MongoDB');
            return;
        } catch (error) {
            console.error(`Error connecting to MongoDB (attempt ${attempt}/${MAX_RETRIES}):`, error.message);
            if (attempt < MAX_RETRIES) {
                console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
                await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
            } else {
                console.error('MongoDB connection failed. Server will start but DB features will not work.');
                console.error('Tip: If you see querySrv ECONNREFUSED, try the standard connection string in Atlas (Connect → Drivers → "Standard connection string") and set MONGO_URI in .env to that.');
            }
        }
    }
}

module.exports = connectToDB;