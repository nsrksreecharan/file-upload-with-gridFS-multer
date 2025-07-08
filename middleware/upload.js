const multer=require("multer");
const { GridFsStorage }=require("multer-gridfs-storage");

// const storage=multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,"uploads")
//     },
//     filename:(req,file,cb)=>{
//         const originalname=file.originalname;
//         cb(null,originalname);
//     }
// });

// In this mongodb will handle the uploads and file will be directly stored in db not in the server files
//Here we are connecting the file upload middleware to mongodb

const storage=new GridFsStorage({
    url:process.env.MONGO_URL,
    file:(req,file)=>{
        
        if (!file.originalname) throw new Error("Filename missing");
        return {
            filename:file.originalname,
            bucketName:"uploads",
            metadata:{
                uploaded_by:"Admin"
            }
        }
    }
});

const fileFilter=(req,file,cb)=>{
    const content_types=["application/pdf","image/png","image/jpg","image/jpeg","video/mp4","audio/mp3"];
    if(content_types?.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(new Error("File Type is not accepted only PDF,JPG,JPEG,PNG,MP4,MP3"));
    }
}
const upload=multer({storage,fileFilter});

module.exports=upload;