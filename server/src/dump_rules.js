const mongoose = require('mongoose');

async function test() {
    await mongoose.connect('mongodb://localhost:27017/vsy-box-cricket');
    const db = mongoose.connection.useDb('vsy-box-cricket');
    const rules = await db.collection('pricingrules').find({}).toArray();
    console.log(rules);
    process.exit(0);
}
test();
