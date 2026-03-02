import cron from 'node-cron';
import Course from '../models/Course.js';

cron.schedule('0 0 * * 0', async () => {
  const now = new Date();

  await Course.updateMany(
    {
      'examStatus.status': 'dates_published',
      'examStatus.examDate': { $lt: now }
    },
    {
      $set: { 'examStatus.status': 'completed' }
    }
  );

  console.log('Expired exams marked as completed');
});