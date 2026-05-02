import React from "react";

export default function About() {
  return (
    <section className="aboutme container" id="About">
    <h4>ABOUT ME</h4>

    <div className="grid-about">
      <div className="intro-text">
        <p>
          I am a System Developer specializing in backend development,
          focused on designing scalable systems, building efficient APIs,
          and writing clean, maintainable code.
          I enjoy solving complex problems and turning ideas into
          reliable, high-performance applications.
        </p>
      </div>

      <div className="columns-wrapper">
        <div className="grid-item">
          <h6>BACKEND DEVELOPMENT</h6>
          <p>
            Designing and building robust APIs, handling business logic,
            and structuring systems for scalability and long-term growth.
          </p>
        </div>

        <div className="grid-item">
          <h6>SYSTEM OPTIMIZATION</h6>
          <p>
            Analyzing performance, debugging issues, and improving system
            efficiency to ensure fast and reliable user experiences.
          </p>
        </div>
      </div>
    </div>
  </section>
  );
}