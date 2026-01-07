export const materialColumns = [
    {
        field: "name",
        headerName: "Material Name",
        width: 250,
    },
    {
        field: "description",
        headerName: "Description",
        width: 500,
    },
    {
        field: "classId",
        headerName: "Assigned To",
        width: 250,
        renderCell: (params) => {
            return params.row.classId ? params.row.classId.name : '';
        }
    }
];