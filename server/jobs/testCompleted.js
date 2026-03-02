import cron from 'node-cron';
import Test from '../models/Test.js';

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  const now = new Date();

  await Test.updateMany(
    {
      'state': 'pending',
      'date': { $lt: now }
    },
    {
      $set: { 'state': 'completed' }
    }
  );

  console.log('Expired tests marked as completed');
});