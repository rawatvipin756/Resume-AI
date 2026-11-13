let inputText=document.getElementById("question");
let sendBtn=document.getElementById("sendBtn");
let chat=document.getElementById("chatBox");

sendBtn.addEventListener("click",()=> {
  if(inputText.value.trim() === ""){
    return;
  }

  let question=inputText.value.trim();

  let userMessage=document.createElement("p");
  userMessage.innerText=question;
  chat.appendChild(userMessage);

  fetch("http://localhost:5000/api/chat",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      question:question
    })
  })
  .then((response)=> {
    return response.json();
  }).then((data)=> {
    console.log(data.message);
    console.log(data.question);
    let botMessage=document.createElement("p");
    botMessage.innerText=data.message;
    chat.appendChild(botMessage);
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