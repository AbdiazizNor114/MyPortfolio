import "../styles/pages/Education.css";

const universityCourses = [
  "Object-Oriented Programming",
  "Data and Information Management",
  "Database Systems",
  "Dynamic Web Applications",
  "Responsive Web Design",
  "Artificial Intelligence",
  "Data Science & Machine Learning",
  "Statistical Analysis",
  "Web-based GIS",
  "IT Project Management",
];

const highSchoolSubjects = [
  "Programming 1 & 2",
  "Network Technology",
  "Web Development",
  "Web Server Programming",
  "Computer Technology",
  "Digital Communication Technology",
  "Alarm, Surveillance and Security Systems",
  "Electronics and Microcomputer Technology",
];

const certificationSkills = [
  "Network configuration for routers and switches",
  "IP addressing and subnetting",
  "OSI model fundamentals",
  "Network security basics",
  "Connectivity troubleshooting",
];

export default function Education() {
  return (
    <div className="education-page">
      <section className="education-hero">
        <span className="education-kicker">Education</span>
        <h1>My Education & Certifications</h1>
        <p>Academic training, practical networking experience, and the technical courses shaping my full-stack and data science work.</p>
      </section>

      <section className="education-card education-card-featured">
        <div className="education-card-header">
          <div>
            <p className="education-label">University Studies</p>
            <h2>Högskolan Dalarna, Sweden</h2>
            <p className="education-muted">Information Systems Programme - Data Science</p>
          </div>
          <p className="education-year">2024 - Present</p>
        </div>

        <p className="education-description">
          I am currently studying courses focused on data science, software
          development, and geographic information systems. My studies emphasize
          problem-solving, machine learning, and building modern web
          applications.
        </p>

        <div className="education-list-block">
          <h4>Relevant Courses</h4>
          <ul>
            {universityCourses.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="education-card">
        <div className="education-card-header">
          <div>
            <p className="education-label">High School Diploma</p>
            <h2>Lugnetgymnasiet, Sweden</h2>
            <p className="education-muted">Electrical and Energy Program - Computer & Communication Technology</p>
          </div>
          <p className="education-year">2022</p>
        </div>

        <p className="education-description">
          I completed my vocational diploma in computer and network technology,
          where I gained foundational knowledge in programming, networking,
          electronics, and web development.
        </p>

        <div className="education-list-block">
          <h4>Relevant Subjects</h4>
          <ul>
            {highSchoolSubjects.map((subject) => (
              <li key={subject}>{subject}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="education-card">
        <div className="education-card-header">
          <div>
            <p className="education-label">Certification</p>
            <h2>CCNA: Introduction to Networks</h2>
            <p className="education-muted">Cisco Networking Academy</p>
          </div>
          <p className="education-year">2024</p>
        </div>

        <p className="education-description">
          This certification provided me with practical skills in networking,
          including configuring routers and switches, understanding network
          protocols, IP addressing, and troubleshooting small networks.
        </p>

        <div className="education-list-block">
          <h4>Skills Gained</h4>
          <ul>
            {certificationSkills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
