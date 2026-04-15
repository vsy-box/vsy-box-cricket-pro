import { Router } from 'express';
import {
  createBooking,
  verifyPayment,
  getUserBookings,
  cancelBooking,
} from '../controllers/bookingController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All booking routes require authentication
router.use(authMiddleware);

router.post('/create', createBooking);
router.post('/verify-payment', verifyPayment);
router.get('/my-bookings', getUserBookings);
router.put('/cancel/:bookingId', cancelBooking);

export default router;
