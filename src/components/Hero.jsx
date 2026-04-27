import React from "react";

export default function Hero() {
  return (
    <section className="hero container">
      <div className="hero-top">
        <div className="content">
          <div className="info">
            <h1>Hi, I am</h1>
            <h2>ABDIAZIZ<br />NOR</h2>
            <h6 className="glow-text">System Developer | Aspiring AI Enthusiast</h6>
          </div>

          <div className="contact-me">
            <a href="https://wa.link/uonz28" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-whatsapp"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="https://github.com/AbdiazizNor114" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-github"></i>
            </a>
          </div>
        </div>

        <div className="person-img">
          <div className="img-ring">
            <img src="./images/i.jpeg" alt="person" />
          </div>
        </div>
      </div>
    </section>
  );
}