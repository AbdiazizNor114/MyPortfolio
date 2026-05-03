import React from "react";

const EXPERIENCE = [
  {
    title: "System Developer",
    company: "Your Company",
    period: "2023 - Present",
    description: "Designing scalable backend systems, building efficient APIs, and implementing machine learning solutions.",
    technologies: ["Python", "Java", "Node.js", "PostgreSQL"]
  },
  {
    title: "Backend Developer",
    company: "Previous Company",
    period: "2022 - 2023",
    description: "Developed RESTful APIs, optimized database queries, and implemented automated testing.",
    technologies: ["JavaScript", "MongoDB", "Express.js"]
  }
];

export default function Experience() {
  return (
    <section className="experience container" id="Experience">
      <h4>EXPERIENCE</h4>
      <div className="experience-timeline">
        {EXPERIENCE.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-header">
              <h5>{exp.title}</h5>
              <span className="company">{exp.company}</span>
              <span className="period">{exp.period}</span>
            </div>
            <p className="description">{exp.description}</p>
            <div className="technologies">
              {exp.technologies.map((tech, i) => (
                <span key={i} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}