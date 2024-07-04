
const User= require('../model/userModel');
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs");

const userRegisterController = async (req,res) =>{
    try {
        const {fullname,email,password }=req.body;

        const existingUser =await User.findOne({email:req.body.email});

        if(existingUser){
          return res.status(200).send(
            {
                status:false,
                message:"user already exist",
                email
            }
          )
        }
         
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
         
      const newUser= new User(req.body);
      const saveUser = await newUser.save();

      return res.status(200).send({
        status: true,
        message:"user is successfully registered",
        saveUser,
        userId: saveUser._id
      })
        
    } catch (error) {
        console.log(error);
      return  res.status(500).send({
          success: false,
          message: "Error In Register API",
          error,
        });


    }
}



const userLoginController = async (req,res) =>{
  try {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email:req.body.email});
    if(!existingUser)return res.status(404).json(
        {
            success: true,
            message: "user does not exist",
        }
    )

    const comparePassword = await bcrypt.compare(
        req.body.password,
        existingUser.password
      );
      if (!comparePassword) {
        return res.status(500).send({
          success: false,
          message: "Invalid Credentials",
        });
      }

   const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
    
  return res.status(200).send({
    success: true,
    message: "User successfully Login",
    existingUser,
    token
  })
    
  } catch (error) {
   return  res.status(500).send({
        success: false,
        message: "Error In Login API",
        error,
      });
  }
}

module.exports= {userRegisterController, userLoginController}