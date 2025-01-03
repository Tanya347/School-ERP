export const attendanceColumns = [
    { field: "name", label: "Name" },
    { field: "enroll", label: "Enrollment Number" },
    {
      field: "status",
      label: "Status",
      render: (value) => <span className={`status ${value}`}>{value}</span>,
    },
];