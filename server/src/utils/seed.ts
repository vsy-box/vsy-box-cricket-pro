import { Admin } from '../models/Admin';

/**
 * Seeds a default admin user if none exists.
 */
export const seedAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        name: 'VSY Admin',
        email: 'admin@vsyboxcricket.com',
        password: 'adminpassword123', // User should change this after first login
      });
      console.log('✅ Default admin seeded: admin@vsyboxcricket.com / adminpassword123');
    }
  } catch (error) {
    console.error('❌ Admin seeding failed:', error);
  }
};
