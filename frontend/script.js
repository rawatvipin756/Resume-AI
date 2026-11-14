let inputText=document.getElementById("question");
let sendBtn=document.getElementById("sendBtn");
let chat=document.getElementById("chatBox");

let conversationHistory = [];


sendBtn.addEventListener("click", async () => {

    const question = inputText.value.trim();

    if (!question) return;

    // Display user message
    const userMessage = document.createElement("p");
    userMessage.innerText = question;
    chat.appendChild(userMessage);

    // Store user message in conversation history
    conversationHistory.push({
        role: "user",
        content: question
    });

    inputText.value = "";

    // Create chatbot message
    const botMessage = document.createElement("p");
    botMessage.innerText = "";
    chat.appendChild(botMessage);

    let fullAnswer = "";

    try {
        const response = await fetch("http://localhost:5000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question,
                history: conversationHistory.slice(0, -1)
            })
        });

        if (!response.ok) {
            throw new Error("Failed to get chatbot response");
        }

        if (!response.body) {
            throw new Error("Response stream is unavailable");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value, {
                stream: true
            });

            fullAnswer += chunk;
            botMessage.innerText = fullAnswer;
        }

        fullAnswer += decoder.decode();
        botMessage.innerText = fullAnswer;

        conversationHistory.push({
            role: "assistant",
            content: fullAnswer
        });

    } catch (error) {
        console.error("Chat error:", error);
        botMessage.innerText = "Sorry, something went wrong. Please try again.";
    }
});


fetch("http://localhost:5000/api/test")
.then((response)=> {
  return response.json();
})
.then((data)=> {
  console.log(data);
});