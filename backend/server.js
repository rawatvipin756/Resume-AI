const express=require("express");
const cors=require("cors");
const axios=require("axios")

let conversationHistory = [];

const app=express();

app.use(cors());
app.use(express.json());

const PORT=5000;

app.get("/api/test",(req,res)=> {
  res.json({
    message:"Backend connected successfully"
  });
});

app.post("/api/chat",async (req,res)=> {
  try{
    const {question,history=[]}=req.body;
    const response=await axios.post(
      "http://127.0.0.1:8000/api/chat",
      {
        question:question,
        history:history
      }
    );
    res.json(response.data);
  }catch(error){
    console.log("Python server Error : ",error.message);
    res.status(500).json({
      message:"Error communicating with Python service"
    });
  }
});

app.listen(PORT,()=> {
  console.log(`Server is running on port ${PORT}`);
});