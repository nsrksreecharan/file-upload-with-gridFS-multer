const express=require("express");
const router=express.Router();
const upload=require("../middleware/upload");
const {getGridFS}=require("../config/db");
const { default: mongoose } = require("mongoose");

router.route("/upload").post(upload.single("file"),async(req,res,next)=>{
    try{
        if(!req.file){
            res.status(401).json({message:"No File Uploaded"});
        }
        const gfs=getGridFS();
        const existing = await gfs.find({ filename: req.file.originalname }).toArray();

        if (existing.length) {
            const fileId = existing[0]._id;
            await gfs.delete(fileId);
        }

        res.status(201).json({
            message:"File Uploaded Successfully",
            file:{
                filename:req.file.originalname,
                type:req.file.mimetype,
                size:req.file.size
            },
        });
    } catch(err){
        next(err);
    }
})

router.route("/file").get((req,res,next)=>{
    try{
        const filename=req.query.file;
        if(!filename){
            return res.status(401).json({message:"file name required to fetch specific file"});
        }
        const gfs=getGridFS();
        gfs.find({filename}).toArray((err,files)=>{
            if(err){
                res.status(500).json({message:"Error while reading file",error:err});
            }
            if(!files || !files?.length){
                return res.status(404).json({message:"File Not Found"})
            }

            const file=files[0];
            res.setHeader("Content-Type",file.contentType);
            res.setHeader("Content-Disposition",`inline; filename=${file.filename}`);
            const readStream=gfs.openDownloadStreamByName(file.filename);
            readStream.pipe(res);
        });
    } catch(err){
        next(err);
    }
});

router.route("/download").get((req,res,next)=>{
    try{
        const filename=req.query.file;
        if(!filename){
            return res.status(401).json({message:"File name is required to download specific file"});
        }
        const gfs=getGridFS();
        gfs.find({filename}).toArray((err,files)=>{
            if(err){
                return res.status(500).json({message:"Server Error while reading file",error:err});
            }

            if(!files || !files.length){
                return res.status(404).json({message:"File Not Found"});
            }

            const file=files[0];
            res.setHeader("Cotnent-Type",file.contentType);
            res.setHeader("Content-Disposition",`attachment; filename=${file.filename}`);
            const readStream=gfs.openDownloadStreamByName(file.filename);
            readStream.pipe(res);
        })
    } catch(err){
        next(err);
    }
})

router.route("/file").delete(async(req,res,next)=>{
    try{
        const filename=req.query.file;
        if(!filename){
            return res.status(401).json({message:"File ID is required to delete a file"});
        }
        const gfs=getGridFS();
        const files=await gfs.find({filename:filename}).toArray();
        if(!files || !files?.length){
            return res.status(404)?.json({message:"File Not Found"});
        }

        const ObjectId=files[0]?._id;
        // const ObjectId=mongoose.Types.ObjectId(fileId);
        gfs.delete(ObjectId,(err)=>{
            if(err){
                return res.status(500).json({message:"Error while delteing the file",error:err});
            }
            res.status(200).json({message:"File Deleted Successfully"});
        })
    } catch(err){
        next(err);
    }
})

module.exports=router;