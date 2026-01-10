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
        field: "classID",
        headerName: "Class",
        width: 100,
        renderCell: (params) => {
            return params.row.classID.name
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