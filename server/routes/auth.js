import express from 'express';
import { signup,login} from '../controllers/auth/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
// router.post('/generate-otp', generateOtp);
// router.post('/verify-otp', verifyOtp);

export default router;
