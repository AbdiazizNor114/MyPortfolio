import React from "react";

export default function About() {
  return (
    <section className="aboutme container" id="About">
      <h4>ABOUT ME</h4>
      <div className="grid-about">
        <div className="intro-text">
          <p>
            I am a System Developer focused on backend development,
            building reliable and scalable systems using APIs,
            logic, and clean architecture.
          </p>
        </div>

        <div className="columns-wrapper">
          <div className="grid-item">
            <h6>BACKEND DEVELOPMENT</h6>
            <p>Building APIs, server logic, and system architecture.</p>
          </div>
          <div className="grid-item">
            <h6>SYSTEM OPTIMIZATION</h6>
            <p>Debugging and improving backend performance.</p>
          </div>
        </div>
      </div>
    </section>
  );
}