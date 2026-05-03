import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const WELCOME_MESSAGE = {
  text: "Hi! I'm Abdiaziz. Ask me about my portfolio, projects, skills, or backend and AI work.",
  sender: "bot",
};

export default function Chatbot() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const nextMessages = [...messages, { text: trimmedInput, sender: "user" }];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Chat request failed.");
      }

      setMessages((prev) => [...prev, { text: data.text, sender: "bot" }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: `Sorry, the chat could not answer right now. ${error.message}`,
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="chat-toggle"
        onClick={() => setOpen((current) => !current)}
        aria-label="Toggle chat"
        type="button"
      >
        <MessageCircle size={24} />
      </button>

      {open && (
        <div className="chatbox">
          <div className="chat-header">
            <h3>Chat with me</h3>
            <button onClick={() => setOpen(false)} className="close-btn" aria-label="Close chat" type="button">
              <X size={18} />
            </button>
          </div>

          <div className="messages">
            {messages.map((msg, index) => (
              <div key={`${msg.sender}-${index}`} className={`message ${msg.sender}`}>
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
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
              disabled={isLoading}
            />
            <button onClick={handleSend} className="send-btn" disabled={isLoading || !input.trim()} type="button">
              {isLoading ? "..." : <Send size={16} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
