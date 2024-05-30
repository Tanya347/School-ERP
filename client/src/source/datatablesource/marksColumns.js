
export const marksColumns = (courses) => {

    // First two fixed columns
    const columns = [
        {
            field: 'enrollment',
            headerName: 'Enrollment Number',
            width: 200
        },
        {
            field: "studentName",
            headerName: "Name",
            width: 200,
        },
    ];

    // Generate dynamic columns for each subject
    courses.forEach((subject) => {
        columns.push({
            field: subject.name,
            headerName: subject.name,
            width: 150, // Adjust width as needed
            sortable: false, // Optionally, set sorting to false
        });
    });

    return columns;
};