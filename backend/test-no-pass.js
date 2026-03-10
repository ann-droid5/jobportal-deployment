const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/jobportal').then(async () => {
    const users = await mongoose.connection.db.collection('users').find({ password: { $exists: false } }).toArray();
    console.log(users.length > 0 ? users.map(u => u.email) : 'No users without password');
    process.exit(0);
});
