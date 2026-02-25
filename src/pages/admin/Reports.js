function Reports() {
  const reports = [
    { id: 1, user: "Ann Maria", issue: "Fake job posting" },
    { id: 2, user: "John Doe", issue: "Unable to apply for job" }
  ];

  return (
    <div className="container mt-4">
      <h3>User Reports & Feedback</h3>

      <ul className="list-group mt-3">
        {reports.map((r) => (
          <li key={r.id} className="list-group-item">
            <strong>{r.user}:</strong> {r.issue}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reports;
