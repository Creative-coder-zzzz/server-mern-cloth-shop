import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {User} from '../../models/User.js'
import {OAuth2Client} from 'google-auth-library'

//google auth 2 client 

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//register
const registerUser = async(req,res)=> {
  const {userName, email, Password} = req.body


  console.log(req.body)
  try{
    
    const checkUser = await User.findOne({email});
    if(checkUser) return res.json({success: false, message: 'User already exists with the same email ID'})

    const hashPassword = await bcrypt.hash(Password, 12);


    const newUser = new User({
      userName, email, password:  hashPassword
    })

    await newUser.save()
    res.status(200).json({
      success: true,
      message: 'Registration successful'
    })

  }catch(e){
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'some error occured',
    })
  }
}


//login

const loginUser = async(req,res)=> {
  const { email, password} = req.body

  try{

    const checkUser = await User.findOne({email});
    if(!checkUser) return res.json({
      success: false,
      message: 'User doesnt exist '
    })

    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);


    if(!checkPasswordMatch) return res.json({
      success: false,
      message: "Incorrect Password"
    })
      
    const token = jwt.sign({
      id: checkUser._id, role: checkUser.role, email: checkUser.email
    },'CLIENT_SECRET_KEY',{expiresIn: '60m'})
    

     

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  }catch(e){
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'some error occured',
    })
  }
}


//google login 

  const googleLogin = async (req, res) => {
    const { idToken } = req.body;

    console.log('token id ', idToken);
    
    
    try {
      // Verifying Google token
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,  // Make sure the client ID is correct
      });
  
      const { email, name, sub } = ticket.getPayload();
  
      // Check if user exists in the database
      let user = await User.findOne({ email });
  
      if (!user) {
        // If user does not exist, create a new user
        user = new User({
          userName: name,
          email: email,
          password: sub,  
          role: 'user',
        });
        await user.save();
      }
  
      // Generate JWT token for the user
      const token = jwt.sign(
        { id: user._id, role: user.role || 'user', email: user.email },
       ' CLIENT_SECRET_KEY',  // Make sure to set this in your environment
        { expiresIn: '60m' }
      );
  
      // Send response with JWT token
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }).json({
        success: true,
        message: 'Logged in with Google successfully',
        user: {
          email: user.email,
          role: user.role || 'user',
          id: user._id,
          userName: user.userName,
        }
      });
    } catch (error) {
      console.log("Google login error:", error);
      res.status(500).json({ success: false, message: 'Google login failed' });
    }
  };
//logout

const logout = (req,res)=>{
  res.clearCookie("token").json({
    success: true,
    message: 'Logged out'
  })
}

//auth middleware

const authMiddleware = async(req,res,next) => {
  const token = req.cookies.token;
  if(!token){
    return res.status(401).json({
      success: false,
      message: 'Unauthorised user!'
    })
  }

  try{
    const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
    req.user = decoded;
    next()
  }catch(e){
    res.status(401).json({
      success:false,
    message: 'Unauthorised user'   
   })
  }
}

export  {registerUser, loginUser, logout, authMiddleware, googleLogin};