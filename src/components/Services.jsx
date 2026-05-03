import React from "react";
import { Bot, Cloud, Database, Gauge, Rocket, Wrench } from "lucide-react";

const SERVICES = [
  {
    Icon: Rocket,
    title: "Backend Development",
    description: "Building scalable APIs, microservices, and robust server-side applications with modern technologies.",
  },
  {
    Icon: Bot,
    title: "AI & Machine Learning",
    description: "Implementing ML solutions, data analysis, and intelligent systems to solve complex problems.",
  },
  {
    Icon: Gauge,
    title: "System Optimization",
    description: "Performance tuning, debugging, and optimization of existing systems for better efficiency.",
  },
  {
    Icon: Wrench,
    title: "API Development",
    description: "Designing and developing RESTful APIs, GraphQL endpoints, and third-party integrations.",
  },
  {
    Icon: Database,
    title: "Database Design",
    description: "Creating efficient database schemas, query optimization, and data management solutions.",
  },
  {
    Icon: Cloud,
    title: "Cloud Solutions",
    description: "Deploying and managing applications on cloud platforms with scalable infrastructure.",
  },
];

export default function Services() {
  return (
    <section className="services container" id="Services">
      <h4>SERVICES</h4>
      <p className="services-intro">
        I offer comprehensive backend development and AI solutions to help bring your ideas to life.
      </p>

      <div className="services-grid">
        {SERVICES.map(({ Icon, title, description }) => (
          <div key={title} className="service-card">
            <div className="service-icon" aria-hidden="true">
              <Icon size={36} strokeWidth={1.8} />
            </div>
            <h5>{title}</h5>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
