import "../../pages/table/tableWithoutAction.scss"

export const attendanceColumns = () => {
    const columns = [
        {
            field: "studentId",
            headerName: "Enrollment Number",
            width: 200,
        },
        {
            field: "studentName",
            headerName: "Name",
            width: 200,
        },
        {
            field: "attendedLectures",
            headerName: "Lectures Attended",
            width: 200,
        },
        {
            field: "totalLectures",
            headerName: "Total Lectures",
            width: 200,
        },
        {
            field: "attendancePercentage",
            headerName: "Percentage %",
            width: 200,
        },
        {
            field: "status",
            headerName: "Status",
            width: 100,
            renderCell: (params) => {
                const statusClass = params.value === 'Okay' ? 'high' : 'low';
                return (
                    <div className={`cellWithStatus ${statusClass}`}>
                    {params.value}
                    </div>
                );
              }
        }
    ]

    return columns
};