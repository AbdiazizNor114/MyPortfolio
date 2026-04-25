export default function Contact() {
  return (
    <section className="container" id="contact">
      <h4>CONTACT</h4>

      <form>
        <input placeholder="Name" />
        <input placeholder="Email" />
        <textarea placeholder="Message" />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}