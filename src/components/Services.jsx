import React from "react";

const SERVICES = [
  {
    icon: "🚀",
    title: "Backend Development",
    description: "Building scalable APIs, microservices, and robust server-side applications with modern technologies."
  },
  {
    icon: "🤖",
    title: "AI & Machine Learning",
    description: "Implementing ML solutions, data analysis, and intelligent systems to solve complex problems."
  },
  {
    icon: "⚡",
    title: "System Optimization",
    description: "Performance tuning, debugging, and optimization of existing systems for better efficiency."
  },
  {
    icon: "🔧",
    title: "API Development",
    description: "Designing and developing RESTful APIs, GraphQL endpoints, and third-party integrations."
  },
  {
    icon: "📊",
    title: "Database Design",
    description: "Creating efficient database schemas, query optimization, and data management solutions."
  },
  {
    icon: "☁️",
    title: "Cloud Solutions",
    description: "Deploying and managing applications on cloud platforms with scalable infrastructure."
  }
];

export default function Services() {
  return (
    <section className="services container" id="Services">
      <h4>SERVICES</h4>
      <p className="services-intro">
        I offer comprehensive backend development and AI solutions to help bring your ideas to life.
      </p>

      <div className="services-grid">
        {SERVICES.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h5>{service.title}</h5>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}