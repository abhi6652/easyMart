import React, { useState } from "react";
import "./ChatBot.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hi! I'm your EasyMart AI Assistant. Ask me anything about our products.",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      // Read raw body first to avoid `res.json()` crashing on HTML responses
      const raw = await res.text();

      if (!res.ok) {
        throw new Error(
          `Chatbot request failed. Status: ${res.status}. First 200 chars: ${raw.slice(
            0,
            200
          )}`
        );
      }

      let data;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        throw new Error(
          `Invalid API response (expected JSON). First 200 chars: ${raw.slice(
            0,
            200
          )}`
        );
      }


      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.reply || data.message || "No response received.",
        },
      ]);
    } catch (error) {
      console.error("ChatBot Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "❌ Unable to connect to AI server.",
        },
      ]);
    } finally {
      setLoading(false);
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
                  justifyContent:
                    msg.sender === "user"
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    backgroundColor:
                      msg.sender === "user"
                        ? "rgb(74, 62, 183)"
                        : "rgb(194, 94, 125)",
                    color: "#fff",
                    opacity: loading && msg.sender === "ai" ? 0.7 : 1,
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
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />

            <button onClick={handleSend} disabled={loading}>
              {loading ? "..." : "➤"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;