import { Router } from 'express';
import auth from '../controllers/auth.controller.js';
const {register, login} = auth;
const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;
