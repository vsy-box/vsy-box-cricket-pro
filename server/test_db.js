const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/vsy-box-cricket');
  const db = mongoose.connection.db;
  
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const currentHour = d.getHours();
  
  console.log('Today:', today, 'currentHour:', currentHour);
  
  const b = await db.collection('bookings').find({ 
    status: 'confirmed', 
    $or: [ 
        { date: { $gt: today } }, 
        { date: today, startHour: { $gte: currentHour } } 
    ] 
  }).toArray();
  
  console.log('Found:', b.length);
  b.forEach(x => console.log(x.date, x.startHour));
  
  process.exit(0);
}

test().catch(console.error);
