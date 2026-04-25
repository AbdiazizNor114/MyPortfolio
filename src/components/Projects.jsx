import { useEffect, useState } from "react";
import { dataService } from "../services/dataService";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setProjects(dataService.getProjects());
  }, []);

  return (
    <section className="container" id="portofolio">
      <h4>PROJECTS</h4>

      <div className="grid-port">
        {projects.map((p) => (
          <div key={p.id} className="grid-col">
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <span>{p.tech}</span>
          </div>
        ))}
      </div>
    </section>
  );
}