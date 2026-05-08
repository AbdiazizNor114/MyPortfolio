import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const WELCOME_MESSAGE = {
  text: "Hi! I'm Abdiaziz. Ask me about my services, projects, skills, backend work, or AI automation ideas.",
  sender: "bot",
};

const QUICK_QUESTIONS = [
  "What services do you offer?",
  "How can AI automation help my business?",
  "What tech stack do you use?",
];

const PORTFOLIO_FACTS = {
  services:
    "I offer AI automation, backend development, AI and machine learning, API development, database design, system optimization, and cloud solutions.",
  aiAutomation:
    "For AI automation, I can build workflow agents, tool integrations, smart reporting, document summarizers, customer-support helpers, and backend automations that connect APIs and databases.",
  skills:
    "My technical skills include Python, Java, C#, Dart, TypeScript, JavaScript, Node.js, databases, API development, machine learning, and GitHub workflows.",
  contact:
    "You can contact me through the contact form on this portfolio, WhatsApp from the hero section, or GitHub at AbdiazizNor114.",
  background:
    "I am a system developer focused on backend systems, APIs, scalable architecture, clean code, machine learning, and AI-powered tools.",
};

function getLocalAnswer(question) {
  const normalized = question.toLowerCase();

  if (normalized.includes("automation") || normalized.includes("ai agent") || normalized.includes("workflow")) {
    return `${PORTFOLIO_FACTS.aiAutomation} A strong first step is to pick one repetitive process, define the inputs and outputs, then connect the right model, API, and approval checks around it.`;
  }

  if (normalized.includes("service") || normalized.includes("offer") || normalized.includes("help")) {
    return PORTFOLIO_FACTS.services;
  }

  if (normalized.includes("skill") || normalized.includes("stack") || normalized.includes("technology") || normalized.includes("tech")) {
    return PORTFOLIO_FACTS.skills;
  }

  if (normalized.includes("contact") || normalized.includes("hire") || normalized.includes("reach")) {
    return PORTFOLIO_FACTS.contact;
  }

  if (normalized.includes("who") || normalized.includes("about") || normalized.includes("background")) {
    return PORTFOLIO_FACTS.background;
  }

  return "I can help with questions about Abdiaziz's services, AI automation, backend development, APIs, databases, skills, projects, and contact details. Try asking what kind of automation would fit your workflow.";
}

export default function Chatbot() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (messageOverride = input) => {
    const trimmedInput = messageOverride.trim();
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

      setMessages((prev) => [...prev, { text: data.text || getLocalAnswer(trimmedInput), sender: "bot" }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: getLocalAnswer(trimmedInput),
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

          {messages.length === 1 && (
            <div className="quick-questions" aria-label="Suggested questions">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleSend(question)}
                  disabled={isLoading}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

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
