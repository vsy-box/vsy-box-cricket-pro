const mongoose = require('mongoose');
const { Booking } = require('./src/models/Booking');

mongoose.connect('mongodb://localhost:27017/vsy-box-cricket').then(async () => {
  const result = await Booking.aggregate([
    { $match: { status: 'confirmed' } },
    {
      $group: {
        _id: {
          $cond: {
            if: {
              $in: ['$razorpayPaymentId', ['CASH_PAYMENT', 'MIGRATED_WALKIN', 'ADMIN_COLLECTED']]
            },
            then: 'walkin',
            else: 'online'
          }
        },
        total: { $sum: '$totalAmount' },
        count: { $sum: 1 }
      }
    }
  ]);
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
});
