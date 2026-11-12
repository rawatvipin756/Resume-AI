const express=require("express");
const cors=require("cors");

const app=express();
app.use(cors());
app.use(express.json());

const PORT=5000;

app.get("/api/test",(req,res)=> {
  res.json({
    message:"Backend connected successfully"
  });
});

app.post("api/chat",(req,res)=> {
  const question=req.body.question;
  res.json({
    message:"Question recieved successfully",
    question:question
  });
});

app.listen(PORT,()=> {
  console.log(`Server is running on port ${PORT}`);
});