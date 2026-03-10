const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/jobportal').then(async () => {
    try {
        const result = await mongoose.connection.db.collection('users').updateMany(
            { education: { $type: "string" } },
            { $set: { education: [] } }
        );
        console.log(`Updated ${result.modifiedCount} users with legacy string education fields to be arrays.`);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
});
