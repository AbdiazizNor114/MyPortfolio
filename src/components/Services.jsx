import React from "react";
import { Bot, Cloud, Database, Gauge, Rocket, Wrench, Zap } from "lucide-react";

const SERVICES = [
  {
    Icon: Zap,
    title: "AI Automation",
    description:
      "Designing practical AI workflows that reduce manual work, connect tools, summarize data, and support faster decisions.",
    highlights: ["Workflow agents", "Tool integrations", "Smart reporting"],
  },
  {
    Icon: Rocket,
    title: "Backend Development",
    description: "Building scalable APIs, microservices, and robust server-side applications with modern technologies.",
    highlights: ["REST APIs", "Business logic", "Clean architecture"],
  },
  {
    Icon: Bot,
    title: "AI & Machine Learning",
    description: "Implementing ML solutions, data analysis, and intelligent systems to solve complex problems.",
    highlights: ["ML models", "Data analysis", "AI features"],
  },
  {
    Icon: Gauge,
    title: "System Optimization",
    description: "Performance tuning, debugging, and optimization of existing systems for better efficiency.",
    highlights: ["Performance", "Debugging", "Reliability"],
  },
  {
    Icon: Wrench,
    title: "API Development",
    description: "Designing and developing RESTful APIs, GraphQL endpoints, and third-party integrations.",
    highlights: ["REST", "GraphQL", "Integrations"],
  },
  {
    Icon: Database,
    title: "Database Design",
    description: "Creating efficient database schemas, query optimization, and data management solutions.",
    highlights: ["Schema design", "Queries", "Data flow"],
  },
  {
    Icon: Cloud,
    title: "Cloud Solutions",
    description: "Deploying and managing applications on cloud platforms with scalable infrastructure.",
    highlights: ["Deployment", "Scalability", "Monitoring"],
  },
];

export default function Services() {
  return (
    <section className="services container" id="Services">
      <h4>SERVICES</h4>
      <p className="services-intro">
        I build backend systems, APIs, and AI automation that turn repetitive work into reliable digital workflows.
      </p>

      <div className="services-grid">
        {SERVICES.map(({ Icon, title, description, highlights }) => (
          <div key={title} className="service-card">
            <div className="service-icon" aria-hidden="true">
              <Icon size={36} strokeWidth={1.8} />
            </div>
            <h5>{title}</h5>
            <p>{description}</p>
            <div className="service-highlights" aria-label={`${title} highlights`}>
              {highlights.map((highlight) => (
                <span key={highlight}>{highlight}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
