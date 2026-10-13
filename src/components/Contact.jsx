import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const formRef = useRef(null);
  const pending = useRef(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);
  async function sendEmail(event) {
    event.preventDefault();
    if (pending.current) return;
    pending.current = true; setSending(true); setStatus(null);
    try {
      await emailjs.sendForm('service_rc09617', 'template_ozk0ioe', formRef.current, 'yDUR2GPj5Ss6xZp5L');
      setStatus({ type: 'success', text: 'Your message was sent. Thank you for getting in touch!' });
      formRef.current.reset();
    } catch {
      setStatus({ type: 'error', text: 'Your message could not be sent. Please retry or use the LinkedIn link below.' });
    } finally { pending.current = false; setSending(false); }
  }
  return <section className="contact container" id="contact">
    <h4>CONTACT</h4>
    <form ref={formRef} onSubmit={sendEmail} aria-busy={sending}>
      <label htmlFor="contact-name" className="sr-only">Your name</label>
      <input id="contact-name" type="text" name="user_name" autoComplete="name" placeholder="YOUR NAME" maxLength={100} required readOnly={sending} />
      <label htmlFor="contact-email" className="sr-only">Your email</label>
      <input id="contact-email" type="email" name="user_email" autoComplete="email" placeholder="YOUR EMAIL" required readOnly={sending} />
      <label htmlFor="contact-message" className="sr-only">Your message</label>
      <textarea id="contact-message" name="message" placeholder="MESSAGE" rows={5} maxLength={5000} required readOnly={sending} />
      <button className="btn" type="submit" disabled={sending}>{sending ? 'SENDING…' : 'SEND MESSAGE'}</button>
      {status && <p role={status.type === 'error' ? 'alert' : 'status'} className={`contact-status ${status.type}`}>{status.text}</p>}
    </form>
    <a href="https://www.linkedin.com/in/abdiaziiz-abdullahi-066a74232/" target="_blank" rel="noopener noreferrer">Prefer LinkedIn? Send me a message there.</a>
  </section>;
}
