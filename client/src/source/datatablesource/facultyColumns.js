export const facultyColumns = [
    {
        field: "user",
        headerName: "User",
        width: 150,
        renderCell: (params) => {
            return (
                <div className="cellWithImg">
                    <img className="cellImg" src={params.row.profilePicture || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"} alt="avatar" />
                    {params.row.username}
                </div>
            );
        },
    },
    {
        field: "teachername",
        headerName: "Name",
        width: 100,
    },
    {
        field: "email",
        headerName: "Email",
        width: 150,
    },
    {
        field: "enroll",
        headerName: "Reg. No.",
        width: 100,
    },
    {
        field: "gender",
        headerName: "Gender",
        width: 100,
    },
    {
        field: "joiningYear",
        headerName: "Joining",
        width: 100,
    },
    {
        field: "facultyPhone",
        headerName: "Phone",
        width: 100,
    },
    {
        field: "facultyAddress",
        headerName: "Address",
        width: 100,
    },
    {
        field: "dob",
        headerName: "Birth Date",
        width: 100,
    }
];