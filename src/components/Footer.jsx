import React from "react";
import { ArrowUpRight, Coffee } from "lucide-react";

export default function Footer() {
  return (
    <footer>
      <div className="container footer-info">
        <div className="footer-support">
          <div>
            <h3>Help fuel the next idea.</h3>
            <p>Enjoy my projects? Your support helps me keep building and sharing.</p>
          </div>
          <a
            className="footer-support-button"
            href="https://buymeacoffee.com/abdiaziznor"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Support my work on Buy Me a Coffee (opens in a new tab)"
          >
            <Coffee size={20} aria-hidden="true" />
            Support my work
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="social">
          <a href="https://github.com/AbdiazizNor114" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/abdiaziiz-abdullahi-066a74232/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
        <p>&copy; 2026 ABDIAZIZ NOR</p>
      </div>
    </footer>
  );
}
