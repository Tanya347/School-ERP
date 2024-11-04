export const courseColumns = [
    {
        field: "name",
        headerName: "Course Name",
        width: 150
    },
    {
        field: "subjectCode",
        headerName: "Subject Code",
        width: 100,
    },
    {
        field: "class",
        headerName: "Class",
        width: 100,
        renderCell: (params) => {
            return params.row.class.name
        }
    },
    {
        field: "teacher",
        headerName: "Teacher",
        width: 200,
        renderCell: (params) => {
            return params.row.teacher ? params.row.teacher.teachername : '';
        }
    }
];