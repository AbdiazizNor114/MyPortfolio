import { MessageCircle, Send, X, RotateCcw, Coffee, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getPortfolioAnswer, MAX_HISTORY, MAX_MESSAGE_LENGTH } from '../../shared/portfolioChat.js';

const WELCOME = { sender: 'bot', text: 'Hi! I’m Abdiaziz’s portfolio assistant. Type any question about him, or try a suggestion below. Ask me about his projects, skills, education, diplomas, CV, services, or how to contact him.' };
const SUGGESTIONS = ['What has Abdiaziz built?', 'Where did he go to high school?', 'What diplomas does he have?', 'Can I download his CV?', 'How can I support your work?'];

export default function Chatbot({ projects = [] }) {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState(null);
  const inputRef = useRef(null);
  const toggleRef = useRef(null);
  const logRef = useRef(null);
  const pendingRef = useRef(false);
  const controllerRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, isLoading, open]);
  useEffect(() => () => controllerRef.current?.abort(), []);

  function closeChat() { setOpen(false); toggleRef.current?.focus(); }
  async function sendMessage(text = input) {
    if (typeof text !== 'string' || !text.trim() || pendingRef.current) return;
    const question = text.trim().slice(0, MAX_MESSAGE_LENGTH);
    const nextMessages = [...messages, { sender: 'user', text: question }];
    const history = nextMessages.slice(1).slice(-MAX_HISTORY);
    pendingRef.current = true;
    setMessages(nextMessages); setInput(''); setIsLoading(true);
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }), signal: controller.signal });
      if (!response.ok) throw new Error('Chat unavailable');
      const data = await response.json();
      if (typeof data.text !== 'string' || !data.text.trim()) throw new Error('Empty reply');
      setMessages(prev => [...prev, { sender: 'bot', text: data.text }]);
      setMode(data.mode === 'ai' ? 'ai' : 'portfolio');
    } catch {
      setMessages(prev => [...prev, { sender: 'bot', text: getPortfolioAnswer(question, history.slice(0, -1), projects) }]);
      setMode('portfolio');
    } finally {
      clearTimeout(timeout); pendingRef.current = false; setIsLoading(false);
      controllerRef.current = null;
    }
  }
  return <>
    <button ref={toggleRef} className="chat-toggle" onClick={() => open ? closeChat() : setOpen(true)} aria-label={open ? 'Close portfolio chat' : 'Open portfolio chat'} aria-expanded={open} aria-controls="portfolio-chat" type="button"><MessageCircle size={24} /></button>
    {open && <section id="portfolio-chat" className="chatbox" role="dialog" aria-labelledby="chat-title" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); closeChat(); } }}>
      <div className="chat-header">
        <div><h3 id="chat-title">Portfolio assistant</h3><p>About Abdiaziz and his work</p></div>
        <div className="chat-actions">
          <button type="button" className="close-btn" aria-label="Start a new chat" disabled={isLoading} onClick={() => { setMessages([WELCOME]); setMode(null); inputRef.current?.focus(); }}><RotateCcw size={17} /></button>
          <button type="button" className="close-btn" aria-label="Close chat" onClick={closeChat}><X size={20} /></button>
        </div>
      </div>
      <div className="messages" ref={logRef} role="log" aria-label="Chat messages" aria-live="polite" aria-relevant="additions" aria-busy={isLoading}>
        {messages.map((message, index) => <div key={index} className={`message ${message.sender}`}><span className="sr-only">{message.sender === 'bot' ? 'Portfolio assistant: ' : 'You: '}</span>{message.text.split(/(https:\/\/[^\s]+)/g).map((part, partIndex) => /^https:\/\//.test(part) ? <a key={partIndex} href={part} target="_blank" rel="noopener noreferrer">{part}</a> : part)}</div>)}
        {isLoading && <div className="message bot typing-indicator" role="status" aria-label="Finding portfolio information"><span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" /></div>}
      </div>
      {messages.length === 1 && <div className="quick-questions" aria-label="Suggested questions">{SUGGESTIONS.map(question => <button key={question} type="button" disabled={isLoading} onClick={() => sendMessage(question)}>{question}</button>)}</div>}
      <form className="input-area" onSubmit={event => { event.preventDefault(); sendMessage(); }}>
        <label className="sr-only" htmlFor="chat-question">Question about Abdiaziz</label>
        <textarea id="chat-question" ref={inputRef} rows={1} value={input} maxLength={MAX_MESSAGE_LENGTH} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); sendMessage(); } }} placeholder="Ask about Abdiaziz…" />
        <button className="send-btn" disabled={isLoading || !input.trim()} type="submit" aria-label="Send question"><Send size={18} /></button>
      </form>
      <p className="chat-footnote">{mode === 'portfolio' ? 'Portfolio answers · AI is temporarily unavailable' : mode === 'ai' ? 'Answers based on this portfolio' : 'Answers stay within this portfolio'}</p>
      <a className="chat-support" href="https://buymeacoffee.com/abdiaziznor" target="_blank" rel="noopener noreferrer" aria-label="Buy Abdiaziz a coffee (opens in a new tab)"><Coffee size={16} aria-hidden="true" /><span>Enjoy my work? Buy me a coffee</span><ArrowUpRight size={15} aria-hidden="true" /></a>
    </section>}
  </>;
}
