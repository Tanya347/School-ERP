import { profile_url } from "../shared/constants";

export const studentColumns = [
    {
        field: "user",
        headerName: "User",
        width: 150,
        renderCell: (params) => {
            return (
                <div className="cell-with-img">
                    <img className="cell-img" src={params.row.profilePicture || profile_url} alt="avatar" />
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