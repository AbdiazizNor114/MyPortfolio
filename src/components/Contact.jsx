import React, { useRef } from "react";

import emailjs from "@emailjs/browser";

export default function Contact() {
  const formRef = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("service_rc09617", "template_ozk0ioe", formRef.current, "yDUR2GPj5Ss6xZp5L")
      .then(() => {
        alert("Message sent successfully!");
        formRef.current.reset();
      })
      .catch((err) => {
        console.error("FAILED...", err);
        alert("Failed to send message");
      });
  };

  return (
    <section className="contact container" id="contact">
      <h4>CONTACT</h4>
      <form ref={formRef} onSubmit={sendEmail}>
        <input type="text" name="user_name" placeholder="YOUR NAME" required />
        <input type="email" name="user_email" placeholder="YOUR EMAIL" required />
        <textarea name="message" placeholder="MESSAGE" rows="5" required />
        <button className="btn" type="submit">SEND MESSAGE</button>
      </form>
    </section>
  );
}