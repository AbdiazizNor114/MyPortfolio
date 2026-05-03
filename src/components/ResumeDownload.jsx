import React from "react";

export default function ResumeDownload() {
  const handleDownload = () => {
    // Create a link to download the resume
    const link = document.createElement('a');
    link.href = '/resume.pdf'; // You'll need to add your resume PDF to the public folder
    link.download = 'Abdiaziz_Nor_Resume.pdf';
    link.click();
  };

  return (
    <div className="resume-download">
      <button onClick={handleDownload} className="resume-btn">
        📄 Download Resume
      </button>
    </div>
  );
}