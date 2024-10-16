import { formatDate } from "../endpoints/transform";

export const taskColumns = [
    // { field: "_id", headerName: "ID", width: 250 },
    {
        field: "title",
        headerName: "Task",
        width: 250,
    },
    {
        field: "desc",
        headerName: "Description",
        width: 500,
    },
    {
        field: "sclass",
        headerName: "Assigned To",
        width: 250,
        renderCell: (params) => {
            return params.row.sclass ? params.row.sclass.name : '';
        }
    },
    {
        field: "deadline",
        headerName: "Deadline",
        width: 200,
        renderCell: (params) => {
            return formatDate(params.value)
        }
    }
];