import React from "react";

export default function About() {
  return (
    <section className="aboutme container" id="About">
    <h4>ABOUT ME</h4>

    <div className="grid-about">
      <div className="intro-text">
        <p>
           I'm Abdiaziz — a System Developer specializing in backend systems, APIs, and AI-powered applications.
          I build things that work: clean architecture, reliable logic, and solutions that solve real problems. 
          Currently studying Systems Science in Sweden while shipping projects that go beyond the classroom.
        </p>
      </div>

      <div className="columns-wrapper">
        <div className="grid-item">
          <h6>BACKEND DEVELOPMENT</h6>
          <p>
            Designing and building APIs, 
            business logic, and system architecture with a focus on clean, maintainable code that scales.
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
