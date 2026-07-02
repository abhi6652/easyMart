import React, { useState } from "react";
import "./ChatBot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
  {
    sender: "ai",
    text: "👋 Hi! I'm your EasyMart AI Assistant. Ask me anything about our products.",
  },
]);

const [input, setInput] = useState("");

const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = input;

  // User message show
  setMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text: userMessage,
    },
  ]);

  setInput("");

  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
      }),
    });

    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: data.reply || data.message || "No response received.",
      },
    ]);
  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: "❌ Unable to connect to AI server.",
      },
    ]);
  }
};

  return (
    <>
      {/* Floating Button */}
   <button
  className="chatbot-toggle"
  onClick={() => setIsOpen(!isOpen)}
>
  <img
    src="/images/chatbot.png"
    alt="EasyMart AI"
    className="chatbot-icon"
  />
</button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>🤖 EasyMart AI</h3>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chatbot-body">
  {messages.map((msg, index) => (
    <div
      key={index}
      style={{
        display: "flex",
        justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          padding: "10px 14px",
          borderRadius: "12px",
          backgroundColor: msg.sender === "user" ? "rgb(74, 62, 183)" : "rgb(194, 94, 125)" ,
          color: "#fff",
        }}
      >
        {msg.text}
      </div>
    </div>
  ))}
</div>

        
          <div className="chatbot-footer">
  <input
    type="text"
    placeholder="Type your message..."
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        handleSend();
      }
    }}
  />

  <button onClick={handleSend}>➤</button>
</div>
        </div>
      )}
    </>
  );
};

export default ChatBot;