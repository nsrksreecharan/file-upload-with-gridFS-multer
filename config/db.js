require("dotenv").config();
const mongoose=require("mongoose");
const {GridFSBucket}=require("mongodb");

let gfs,gridfsBucket;


const connectDB=async()=>{
    try{
        const connection=await mongoose.connect(process.env.MONGO_URL,{dbName:"test"});
        const db=mongoose.connection.db;

        // Seting up the gridfs connection to bucket similar to s3
        gridfsBucket=new GridFSBucket(db,{bucketName:"uploads"});
        gfs=gridfsBucket;
        console.log("DB Connected Successfully & GridFSBucket Connected Successfully");
    } catch(err){
        console.log("Error while connecting to DB",err);
        process.exit(1);
    }
}

module.exports={connectDB,getGridFS:()=> gfs};