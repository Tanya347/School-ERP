import { width } from "@mui/system";

export const updateColumns = [
    { field: "_id", headerName: "ID", width: 100 },
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
        field: "class",
        headerName: "Class",
        width: 150,
        renderCell: (params) => {
            return params.row.class ? params.row.class.name : '';
        }
    }
];