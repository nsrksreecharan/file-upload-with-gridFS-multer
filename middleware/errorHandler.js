module.exports=(err,req,res,next)=>{
    console.log("Error Stack",err.stack);
    res.status(500).json({message:"Internal Server Error"});
};