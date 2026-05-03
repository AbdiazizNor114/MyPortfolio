import { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      text: "Hi! 👋 I'm Abdiaziz AI Assistant trained with real AI. Ask me anything about my portfolio, projects, or anything else!",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

      if (!apiKey) {
        setMessages((prev) => [
          ...prev,
          {
            text: "⚠️ API key not configured. Please set VITE_OPENAI_API_KEY in your .env.local file.",
            sender: "bot",
          },
        ]);
        setIsLoading(false);
        return;
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are Abdiaziz Nor, a System Developer specializing in backend development. You focus on designing scalable systems, building efficient APIs, and writing clean, maintainable code. You enjoy solving complex problems and turning ideas into reliable, high-performance applications. You work with Python, Java, C#, Dart, TypeScript, JavaScript, Node.js, databases, machine learning, API development, and GitHub. You have built various projects including ML applications and system development work. Answer questions as if you are the portfolio owner - speak in first person, be friendly, and provide detailed information about your skills, projects, and experience. Never mention being an AI assistant or OpenAI - just be yourself, the developer behind this portfolio.",
            },
            ...messages
              .filter((msg) => msg.sender !== undefined)
              .map((msg) => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text,
              })),
            { role: "user", content: input },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "API request failed");
      }

      const data = await response.json();
      const botMsg = {
        text: data.choices[0].message.content,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: `Sorry, I encountered an error: ${error.message}. Please check your API key and try again.`,
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <div className="chat-toggle" onClick={() => setOpen(!open)}>
        💬
      </div>

      {open && (
        <div className="chatbox">
          <div className="chat-header">
            <h3>Chat with me</h3>
            <button 
              onClick={() => setOpen(false)}
              className="close-btn"
            >
              ✕
            </button>
          </div>
          
          <div className="messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}

            {isLoading && (
              <div className="message bot typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
              placeholder="Ask me anything..."
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className="send-btn"
              disabled={isLoading}
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}