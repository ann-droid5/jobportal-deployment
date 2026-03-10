import { useState } from "react";

function ResumeUpload() {
  const [resume, setResume] = useState(null);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  return (
    <div className="container mt-4">
      <h3>Upload Resume</h3>

      <div className="card p-3 mt-3">
        <input
          type="file"
          className="form-control"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        {resume && (
          <p className="mt-2 text-success">
            Uploaded: {resume.name}
          </p>
        )}

        <p className="text-muted mt-2">
          Supported formats: PDF, DOC, DOCX
        </p>
      </div>
    </div>
  );
}

export default ResumeUpload;
