import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const WELCOME_MESSAGE = {
  text: "Hi, I'm Abdiaziz. Ask me about my skills, education, projects, AI automation, backend/API work, or how to contact me.",
  sender: "bot",
};

const QUICK_QUESTIONS = [
  "What are your strongest skills?",
  "What can you build for a client?",
  "Tell me about your AI and ML experience",
];

const PORTFOLIO_FACTS = {
  intro:
    "I'm Abdiaziz Nor, a System Developer and AI enthusiast based in Sweden. I focus on backend systems, APIs, React frontends, Firebase-backed apps, and practical AI automation.",
  services:
    "I can help with backend development, REST API design, Firebase/Firestore data flows, React portfolio or business websites, AI automation, dashboard-style admin tools, and performance/debugging improvements.",
  aiAutomation:
    "My AI automation focus is practical: workflow assistants, document summarizers, support/chat helpers, smart reporting, API-connected automations, and tools that reduce repetitive admin work.",
  ml:
    "My machine learning work is Python-based and connected to my data science studies. I focus on data analysis, model training basics, classification/regression concepts, and using ML features inside useful applications instead of only theory.",
  skills:
    "My stack includes React, Tailwind CSS, JavaScript, TypeScript, Node.js, Firebase Firestore, MongoDB, Python, Java, C#, Dart, Flutter, API development, Git, GitHub, and Python-based machine learning.",
  databases:
    "The databases I currently list are Firebase Firestore and MongoDB. Firestore fits real-time portfolio/admin content, while MongoDB is useful for document-based backend APIs.",
  projects:
    "This portfolio itself is one of my live projects: React 18, Vite, Tailwind CSS, Firebase, EmailJS, React Router, an admin panel, blog content, and a custom domain. The project section can show more work as I publish it.",
  education:
    "I'm studying Information Systems with a Data Science focus at Hogskolan Dalarna. Relevant courses include AI, Data Science & Machine Learning, Database Systems, Dynamic Web Applications, Responsive Web Design, and IT Project Management. I also completed CCNA: Introduction to Networks.",
  contact:
    "You can contact me through the contact form on this portfolio, WhatsApp from the hero section, LinkedIn, or GitHub at AbdiazizNor114.",
  background:
    "I'm a System Developer student building toward backend, AI, and full-stack work. I like turning practical problems into clean, working applications with clear data flow and maintainable code.",
  availability:
    "I'm open to internships, junior developer opportunities, portfolio collaborations, and small client projects where I can build real systems and keep improving.",
};

const INTENTS = [
  {
    id: "automation",
    keywords: ["automation", "ai agent", "workflow", "summarizer", "support bot", "chatbot"],
    answer: () =>
      `${PORTFOLIO_FACTS.aiAutomation} A good first project is one repetitive workflow with clear inputs, outputs, and a human approval step before anything important is changed.`,
    more:
      "For example, I could build a small assistant that reads form submissions, summarizes the request, stores it in Firebase Firestore, and helps prepare a reply. For businesses, I would start with one task that repeats every week and automate that first.",
  },
  {
    id: "ml",
    keywords: ["machine learning", "ml", "model", "data science", "ai experience"],
    answer: () => PORTFOLIO_FACTS.ml,
    more:
      "The strongest direction for me right now is applied ML: cleaning data, understanding patterns, training basic models, and connecting results to real apps. I want the ML work to produce something useful, such as predictions, recommendations, classification, or better reporting.",
  },
  {
    id: "databases",
    keywords: ["database", "firestore", "firebase", "mongodb", "mongo", "sql"],
    answer: () => PORTFOLIO_FACTS.databases,
    more:
      "In this portfolio, Firebase Firestore is useful for dynamic content like projects and blog posts. MongoDB is a good fit when I build Node.js APIs with flexible document data. I prefer naming the database instead of saying only 'database' because it tells visitors what I can actually work with.",
  },
  {
    id: "services",
    keywords: ["service", "offer", "client", "business", "build for me", "help me"],
    answer: () =>
      `${PORTFOLIO_FACTS.services} If you already have an idea, the best next step is to describe the problem, the users, and what data needs to move through the system.`,
    more:
      "A good client project for me would be a small web app, admin dashboard, API, portfolio, contact workflow, Firebase-backed content system, or automation that saves time. I care about building something clean, understandable, and easy to maintain.",
  },
  {
    id: "skills",
    keywords: ["skill", "stack", "technology", "tech", "strongest", "tools"],
    answer: () => PORTFOLIO_FACTS.skills,
    more:
      "My strongest practical combination is React, Tailwind CSS, Firebase Firestore, JavaScript/TypeScript, and API thinking. I also use Python for data science and machine learning practice, and I keep Java, C#, Dart, and Flutter in my broader programming toolkit.",
  },
  {
    id: "projects",
    keywords: ["project", "portfolio", "built", "work", "github"],
    answer: () => PORTFOLIO_FACTS.projects,
    more:
      "The portfolio shows my ability to ship a real React app: routing, SEO metadata, social preview image, Firebase content, EmailJS contact flow, admin panel, and Vercel deployment. I can keep adding stronger project case studies as I publish them.",
  },
  {
    id: "education",
    keywords: ["education", "study", "school", "university", "course", "ccna"],
    answer: () => PORTFOLIO_FACTS.education,
    more:
      "My education combines software development, web applications, databases, AI, data science, and networking. That mix is useful because I understand both application code and the systems/data behind it.",
  },
  {
    id: "contact",
    keywords: ["contact", "hire", "reach", "email", "linkedin", "whatsapp"],
    answer: () => PORTFOLIO_FACTS.contact,
    more:
      "The fastest ways are the contact form or WhatsApp link on the homepage. LinkedIn is best for professional messages, and GitHub is best if someone wants to review my code.",
  },
  {
    id: "availability",
    keywords: ["available", "internship", "job", "junior", "opportunity", "freelance"],
    answer: () => PORTFOLIO_FACTS.availability,
    more:
      "The best fit would be a role or project where I can work on backend APIs, React interfaces, Firebase/MongoDB data, or AI automation while learning from real production feedback.",
  },
  {
    id: "intro",
    keywords: ["who", "about", "background", "introduce", "tell me about you"],
    answer: () => PORTFOLIO_FACTS.intro,
    more:
      "I am currently building my skills through university studies, portfolio projects, and practical improvements like this site. My direction is backend plus AI, with enough frontend skill to build complete, usable products.",
  },
];

const FOLLOW_UP_PATTERNS = [
  "tell me more",
  "more",
  "explain",
  "details",
  "go on",
  "continue",
  "what else",
];

const SOURCE_PATTERNS = ["from where", "where", "source", "based on what", "how do you know"];

function findLastIntent(messages) {
  const previousUserMessages = messages
    .filter((message) => message.sender === "user")
    .map((message) => message.text.toLowerCase())
    .reverse();

  return previousUserMessages
    .map((text) =>
      INTENTS.find(({ keywords }) => keywords.some((keyword) => text.includes(keyword)))
    )
    .find(Boolean);
}

function getLocalAnswer(question, conversation = []) {
  const normalized = question.toLowerCase();
  const matchedIntent = INTENTS.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );

  if (matchedIntent) return matchedIntent.answer();

  const previousIntent = findLastIntent(conversation);

  if (previousIntent && FOLLOW_UP_PATTERNS.some((pattern) => normalized.includes(pattern))) {
    return previousIntent.more;
  }

  if (previousIntent && SOURCE_PATTERNS.some((pattern) => normalized.includes(pattern))) {
    if (previousIntent.id === "education") {
      return "That comes from my education section: Information Systems Programme - Data Science at Hogskolan Dalarna, plus CCNA: Introduction to Networks from Cisco Networking Academy.";
    }

    if (previousIntent.id === "skills") {
      return "Those skills come from this portfolio and my current work: the site uses React, Tailwind CSS, Firebase, EmailJS, and React Router, while my broader studies and projects cover Python, Java, C#, Dart, Flutter, MongoDB, APIs, and machine learning.";
    }

    if (previousIntent.id === "projects") {
      return "That is based on this live portfolio project and the code behind it: React 18, Vite, Tailwind CSS, Firebase, EmailJS, React Router, an admin panel, blog content, SEO metadata, and Vercel deployment.";
    }

    return "That answer is based on the portfolio content: my About, Skills, Services, Projects, Education, and Contact sections.";
  }

  if (normalized.length < 8) {
    return "I did not fully understand that. Do you want to know about my skills, education, projects, AI automation, databases, or contact details?";
  }

  return "I can answer that better if you choose a topic: skills, projects, education, Firebase/MongoDB, React/Tailwind, AI automation, machine learning, services, or contact details.";
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

      setMessages((prev) => [...prev, { text: data.text || getLocalAnswer(trimmedInput, nextMessages), sender: "bot" }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: getLocalAnswer(trimmedInput, nextMessages),
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
