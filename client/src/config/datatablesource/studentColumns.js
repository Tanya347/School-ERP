export const studentColumns = [
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
        field: "name",
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
        headerName: "Enroll No",
        width: 100,
    },
    {
        field: "class",
        headerName: "Class",
        width: 100,
        renderCell: (params) => {
            return params.row.class ? params.row.class.name : '';
        }
    },
    {
        field: "gender",
        headerName: "Gender",
        width: 100,
    },
    {
        field: "studentPhone",
        headerName: "Phone",
        width: 100,
    },
    {
        field: "studentAddress",
        headerName: "Address",
        width: 100,
    },
    {
        field: "dob",
        headerName: "Birth Date",
        width: 100,
    },
];