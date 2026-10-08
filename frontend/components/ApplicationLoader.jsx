import { useEffect, useState } from "react";

function ApplicationLoader() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    console.log("Application component loaded");

    const demoApplications = [
      {
        id: 1,
        company: "TCS",
        jobTitle: "Software Engineer",
        status: "Applied",
      },
      {
        id: 2,
        company: "Endava",
        jobTitle: "Software Engineer",
        status: "Interview",
      },
    ];

    setApplications(demoApplications);
  }, []);

  return (
    <div>
      <h2>Applications</h2>

      {applications.map((application) => (
        <div key={application.id}>
          <p>{application.company}</p>
          <p>{application.jobTitle}</p>
          <p>{application.status}</p>
        </div>
      ))}
    </div>
  );
}

export default ApplicationLoader;
