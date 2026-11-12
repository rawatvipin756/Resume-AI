let inputText=document.getElementById("question");
let sendBtn=document.getElementById("sendBtn");
let chat=document.getElementById("chatBox");

sendBtn.addEventListener("click",()=> {
  if(inputText.value.trim() === ""){
    return;
  }
  let input=document.createElement("p");
  input.innerText=inputText.value.trim();
  chat.appendChild(input);
  inputText.value="";
});

fetch("http://localhost:5000/api/test")
.then((response)=> {
  return response.json();
})
.then((data)=> {
  console.log(data);
});