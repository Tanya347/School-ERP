export const studentColumns = [
    {
      field: "name",
      label: "Name",
      render: (value, row) => (
        <div className="cellWrapper">
          <img
            src={row.profilePicture || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
            alt="avatar"
            className="image"
          />
          {value}
        </div>
      ),
    },
    { field: "enroll", label: "Enrollment Number" },
    { field: "gender", label: "Gender" },
    { field: "email", label: "Email" },
    { field: "studentPhone", label: "Phone" },
];