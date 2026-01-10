export const updateColumns = [
    {
        field: "title",
        headerName: "Update",
        width: 150,
    },
    {
        field: "desc",
        headerName: "Description",
        width: 500,
    },
    {
        field: "updateType",
        headerName: "Notice Type",
        width: 150,
    },
    {
        field: "classID",
        headerName: "Class",
        width: 150,
        renderCell: (params) => {
            return params.row.classID ? params.row.classID.name : '';
        }
    }
];