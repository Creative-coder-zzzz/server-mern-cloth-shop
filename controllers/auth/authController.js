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
    

     

    res.cookie("local_token", token, { httpOnly: true, secure: false }).json({
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

 
//logout

const logout = (req,res)=>{
  res.clearCookie("token").json({
    success: true,
    message: 'Logged out'
  })
}

//auth middleware

const authMiddleware = async(req,res,next) => {
  const token = req.cookies.local_token;
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

export  {registerUser, loginUser, logout, authMiddleware};