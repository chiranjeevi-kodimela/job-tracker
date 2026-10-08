function ApplicationList() {
  const applications = [
    {
      id: 1,
      company: "TCS",
      jobTitle: "Software Engineer",
      status: "Applied",
    },
    {
      id: 2,
      company: "Endava",
      jobTitle: "Graduate Software Engineer",
      status: "Interview",
    },
    {
      id: 3,
      company: "Infosys",
      jobTitle: "Frontend Developer",
      status: "Rejected",
    },
  ];

  return (
    <div>
      <h2>My Applications</h2>

      {applications.map((application) => (
        <div key={application.id}>
          <h3>{application.jobTitle}</h3>
          <p>Company: {application.company}</p>
          <p>Status: {application.status}</p>
        </div>
      ))}
    </div>
  );
}

export default ApplicationList;
