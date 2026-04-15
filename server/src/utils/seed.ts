import { Admin } from '../models/Admin';
import { PricingRule } from '../models/PricingRule';

/**
 * Seeds a default admin user if none exists.
 */
export const seedAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        name: 'VSY Admin',
        email: process.env.ADMIN_EMAIL || 'admin@vsyboxcricket.com',
        password: process.env.ADMIN_PASSWORD || 'adminpassword123',
      });
      console.log(`✅ Default admin seeded: ${process.env.ADMIN_EMAIL || 'admin@vsyboxcricket.com'}`);
    }
    
    // Also seed default pricing if empty
    const pricingCount = await PricingRule.countDocuments();
    if (pricingCount === 0) {
      const defaultRules = [];
      const turfs: ('A' | 'B')[] = ['A', 'B'];
      
      for (const turfId of turfs) {
        // Weekday Morning (6 AM - 4 PM)
        defaultRules.push({ turfId, dayType: 'weekday', startHour: 6, endHour: 16, price: 800 });
        // Weekday Evening (4 PM - 12 AM)
        defaultRules.push({ turfId, dayType: 'weekday', startHour: 16, endHour: 24, price: 1200 });
        // Weekend Morning (6 AM - 4 PM)
        defaultRules.push({ turfId, dayType: 'weekend', startHour: 6, endHour: 16, price: 1000 });
        // Weekend Evening (4 PM - 12 AM)
        defaultRules.push({ turfId, dayType: 'weekend', startHour: 16, endHour: 24, price: 1500 });
      }
      
      await PricingRule.insertMany(defaultRules);
      console.log('✅ Default pricing rules seeded for both turfs');
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
};
