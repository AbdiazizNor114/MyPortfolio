import React from "react";

const SKILLS = [
  { img: "./images/Python-logo-notext.svg.png", name: "Python" },
  { img: "./images/Java_programming_language_logo.svg", name: "Java" },
  { img: "./images/csharp_logo.png", name: "C#" },
  { img: "./images/dart-logo-for-shares.png", name: "Dart" },
  { img: "./images/typscript.png", name: "TypeScript" },
  { img: "./images/javascript.svg", name: "JavaScript" },
  { img: "./images/nodejs.png", name: "Node.js" },
  { img: "./images/database-icon.jpg", name: "Database" },
  { img: "./images/machine-learning.svg", name: "ML" },
  { img: "./images/API.png", name: "API Dev" },
  { img: "./images/GitHub_Invertocat_Logo.svg", name: "GitHub" },
];

export default function Skills() {
  return (
    <section className="skills container" id="Skills">
      <h4>TECHNICAL SKILLS</h4>
      <div className="skills-grid">
        {SKILLS.map((s) => (
          <div key={s.name} className="skill-card">
            <img src={s.img} alt={s.name} />
            <p>{s.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}