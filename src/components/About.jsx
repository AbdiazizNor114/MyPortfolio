import React from "react";

export default function About() {
  return (
    <section className="aboutme container" id="About">
    <h4>ABOUT ME</h4>

    <div className="grid-about">
      <div className="intro-text">
        <p>
          I am a System Developer student with a strong interest in backend
          development, APIs, databases, and AI-powered solutions. I enjoy
          learning how reliable systems are built, solving practical problems,
          and turning ideas into working applications.
        </p>
      </div>

      <div className="columns-wrapper">
        <div className="grid-item">
          <h6>BACKEND DEVELOPMENT</h6>
          <p>
            Building my skills in API development, business logic, and system
            structure while focusing on clean, maintainable code.
          </p>
        </div>

        <div className="grid-item">
          <h6>SYSTEM OPTIMIZATION</h6>
          <p>
            Practicing debugging, performance thinking, and small improvements
            that make applications more reliable and easier to use.
          </p>
        </div>
      </div>
    </div>
  </section>
  );
}
