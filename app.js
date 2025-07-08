const express=require("express");
const app=express();
const cors=require("cors");
const morgan=require("morgan");
const errorHandler=require("./middleware/errorHandler");
const fileRoutes=require("./router/fileRoutes");

app.use(cors());
app.use(morgan("dev"));

app.use("/file-api",fileRoutes);

app.use((req,res)=>{
    res.status(404).json({
        message:"Route Not Found"
    })
});

app.use(errorHandler);

module.exports=app;
