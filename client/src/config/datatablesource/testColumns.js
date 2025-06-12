import { formatDate } from "../endpoints/transform";

export const testColumns = [
    {
        field: "name",
        headerName: "Test",
        width: 100,
    },
    {
        field: "syllabus",
        headerName: "Syllabus",
        width: 300,
    },
    {
        field: "duration",
        headerName: "Duration",
        width: 100
    },
    {
        field: "state",
        headerName: "Status",
        width: 150
    },
    {
        field: "date",
        headerName: "Date",
        width: 150,
        renderCell: (params) => {
            return formatDate(params.value);
        }
    },
    {
        field: "totalMarks",
        headerName: "Marks",
        width: 100
    },

];