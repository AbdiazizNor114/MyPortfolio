import React from "react";
import { CV_ICON_URL, CV_URL } from "../constants";

export default function Hero() {
  return (
    <section className="hero container">
      <div className="hero-top">
        <div className="content">
          <div className="info">
            <h1>Hi, I am</h1>
            <h2>ABDIAZIZ<br />NOR</h2>
            <h6 className="glow-text">Full-stack developer building backend systems, AI tools, and practical web apps</h6>
          </div>

          <div className="contact-me">
            <a href="https://wa.link/uonz28" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-whatsapp"></i>
            </a>
            <a href="https://www.linkedin.com/in/abdiaziiz-abdullahi-066a74232/" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="https://github.com/AbdiazizNor114" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href={CV_URL} target="_blank" rel="noopener noreferrer" aria-label="Download CV">
              <img className="cv-icon" src={CV_ICON_URL} alt="" />
            </a>
          </div>
        </div>

        <div className="person-img">
          <div className="img-ring">
            <img src="./images/y.JPG" alt="Abdiaziz Nor - System Developer and AI Enthusiast" />
          </div>
        </div>
      </div>
    </section>
  );
}
