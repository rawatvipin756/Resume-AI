let inputText=document.getElementById("question");
let sendBtn=document.getElementById("sendBtn");
let chat=document.getElementById("chatBox");

let conversationHistory = [];

sendBtn.addEventListener("click",()=> {
  if(inputText.value.trim() === ""){
    return;
  }

  const question=inputText.value.trim();

  if(!question) return;

  const userMessage=document.createElement("p");
  userMessage.innerText=question;
  chat.appendChild(userMessage);

  let fullAns="";

  try{}

  conversationHistory.push({
    role: "user",
    content: question
  });

  fetch("http://localhost:5000/api/chat",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      question:question,
      history:conversationHistory.slice(0,-1)
    })
  })
  .then((response)=> {
    return response.json();
  })
  .then((data)=> {
    let botMessage=document.createElement("p");
    botMessage.innerText=data.answer;
    conversationHistory.push({
      role: "assistant",
      content: data.answer
    });
    chat.appendChild(botMessage);
  })
  .catch((error)=> {
    console.error("Chat error:",error);
  })

  inputText.value="";
});

fetch("http://localhost:5000/api/test")
.then((response)=> {
  return response.json();
})
.then((data)=> {
  console.log(data);
});