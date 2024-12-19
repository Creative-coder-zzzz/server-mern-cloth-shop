

import express from 'express' 
import {authMiddleware, googleLogin, loginUser, logout, registerUser} from '../../controllers/auth/authController.js'
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logout);
router.get('/check-auth', authMiddleware, (req,res)=>{
  const user = req.user;
  res.status(200).json({
    success: true,
    message: 'Authenticated User',
    user
  })
})

router.post('/googleLogin', googleLogin)
export default router;