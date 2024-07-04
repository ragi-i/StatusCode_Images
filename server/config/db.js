const mongoose=require('mongoose');

 const connectDB= async()=>{
    try{
          await mongoose.connect(process.env.MONGO_URL);
       
        console.log(`connected to mongoDB database ${mongoose.connection.host}`);
       
        
}catch(error){
    console.log(`mongodb database error ${error}`);
}
}
    
module.exports = connectDB;