import { formatDate } from "../endpoints/transform";

export const testColumns = [
    {
        field: "name",
        headerName: "Test",
        width: 200,
    },
    {
        field: "syllabus",
        headerName: "Syllabus",
        width: 300,
    },
    {
        field: "duration",
        headerName: "Duration",
        width: 150
    },
    {
        field: "date",
        headerName: "Date",
        width: 200,
        renderCell: (params) => {
            return formatDate(params.value);
        }
    },
    {
        field: "totalMarks",
        headerName: "Marks",
        width: 150
    }

];