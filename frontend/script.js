
const inputText = document.getElementById("question");
const sendBtn = document.getElementById("sendBtn");
const chat = document.getElementById("chatBox");

const welcomeSection = document.getElementById("welcomeSection");
const newChatBtn = document.getElementById("newChatBtn");
const conversationList = document.getElementById("conversationList");
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

const STORAGE_KEY = "vipin_ai_conversations";

let conversations = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
);

let activeConversationId = null;
let isGenerating = false;


// Save conversations in browser storage
function saveConversations() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(conversations)
    );
}


// Find active conversation
function getActiveConversation() {
    return conversations.find(
        conversation => conversation.id === activeConversationId
    );
}


// Create a new conversation
function createNewChat() {
    if (isGenerating) return;

    activeConversationId = null;

    chat.innerHTML = "";
    inputText.value = "";

    welcomeSection.classList.remove("hidden");

    renderSidebar();

    inputText.focus();

    sidebar.classList.remove("open");
}


// Display conversation history in sidebar
function renderSidebar() {
    conversationList.innerHTML = "";

    const sortedConversations = [...conversations].sort(
        (a, b) => b.updatedAt - a.updatedAt
    );

    sortedConversations.forEach(conversation => {

        const item = document.createElement("div");
        item.className = "conversation-item";

        const historyButton = document.createElement("button");
        historyButton.className = "history-btn";

        if (conversation.id === activeConversationId) {
            historyButton.classList.add("active");
        }

        historyButton.innerText = conversation.title;

        historyButton.addEventListener("click", () => {
            openConversation(conversation.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-chat-btn";
        deleteButton.innerText = "×";
        deleteButton.title = "Delete conversation";

        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            deleteConversation(conversation.id);
        });

        item.appendChild(historyButton);
        item.appendChild(deleteButton);

        conversationList.appendChild(item);
    });
}


// Display one saved conversation
function openConversation(id) {
    if (isGenerating) return;

    const conversation = conversations.find(
        item => item.id === id
    );

    if (!conversation) return;

    activeConversationId = id;

    renderMessages(conversation.messages);
    renderSidebar();

    sidebar.classList.remove("open");
}


// Render messages
function renderMessages(messages) {
    chat.innerHTML = "";

    welcomeSection.classList.toggle(
        "hidden",
        messages.length > 0
    );

    messages.forEach(message => {
        addMessage(message.role, message.content);
    });

    chat.scrollTop = chat.scrollHeight;
}


// Add a message to chat window
function addMessage(role, content) {
    const message = document.createElement("div");

    message.classList.add("message");

    if (role === "user") {
        message.classList.add("user-message");
    } else {
        message.classList.add("bot-message");
    }

    message.innerText = content
    .replace(/\*\*/g, "")
    .replace(/\*/g, "");

    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;

    return message;
}


// Delete a conversation
function deleteConversation(id) {
    if (isGenerating) return;

    conversations = conversations.filter(
        conversation => conversation.id !== id
    );

    if (activeConversationId === id) {
        activeConversationId = null;

        const latestConversation = [...conversations].sort(
            (a, b) => b.updatedAt - a.updatedAt
        )[0];

        if (latestConversation) {
            openConversation(latestConversation.id);
        } else {
            createNewChat();
        }
    }

    saveConversations();
    renderSidebar();
}


// Send message
async function sendMessage() {

    const question = inputText.value.trim();

    if (!question || isGenerating) return;

    let conversation = getActiveConversation();

    // Create conversation when starting a new chat
    if (!conversation) {

        conversation = {
            id: crypto.randomUUID(),
            title: question.length > 32
                ? question.substring(0, 32) + "..."
                : question,
            messages: [],
            updatedAt: Date.now()
        };

        conversations.push(conversation);
        activeConversationId = conversation.id;
    }

    // Store user message
    conversation.messages.push({
        role: "user",
        content: question
    });

    conversation.updatedAt = Date.now();

    inputText.value = "";

    renderMessages(conversation.messages);
    renderSidebar();
    saveConversations();

    // Prepare AI message bubble
    const botMessage = addMessage("assistant", "");

    isGenerating = true;
    sendBtn.disabled = true;

    let fullAnswer = "";

    try {

        const response = await fetch(
            "http://localhost:5000/api/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: question,
                    history: conversation.messages.slice(0, -1)
                })
            }
        );

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

            botMessage.innerText = fullAnswer.replace(/\*\*/g, "").replace(/\*/g, "");

            chat.scrollTop = chat.scrollHeight;
        }

        fullAnswer += decoder.decode();

        botMessage.innerText = fullAnswer.replace(/\*\*/g, "").replace(/\*/g, "");

        // Save AI response
        conversation.messages.push({
            role: "assistant",
            content: fullAnswer
        });

        conversation.updatedAt = Date.now();

    } catch (error) {

        console.error("Chat error:", error);

        botMessage.innerText =
            "Sorry, something went wrong. Please try again.";

    } finally {

        isGenerating = false;
        sendBtn.disabled = false;

        saveConversations();
        renderSidebar();

        chat.scrollTop = chat.scrollHeight;
        inputText.focus();
    }
}


// New chat button
newChatBtn.addEventListener("click", createNewChat);


// Send button
sendBtn.addEventListener("click", sendMessage);


// Press Enter to send
inputText.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});


// Mobile sidebar toggle
sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});


// Restore most recent conversation after reload
function initializeChat() {

    renderSidebar();

    if (conversations.length > 0) {

        const latestConversation = [...conversations].sort(
            (a, b) => b.updatedAt - a.updatedAt
        )[0];

        openConversation(latestConversation.id);

    } else {

        createNewChat();
    }
}

initializeChat();
