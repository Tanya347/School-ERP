import './marksheet.scss'

import { useAuth } from '../../config/context/AuthContext';
import { getSingleData } from '../../config/endpoints/get';
import useFetch from '../../config/service/useFetch';

import DownloadableCard from '../../components/downloadableCard/DownloadableCard';
import GenericTable from '../../components/shared/table/Table';
import InforBanner from '../../components/shared/infoBanner/InforBanner';

const Marksheet = () => {

  const {user} = useAuth();
  const { data: schoolData } = useFetch(getSingleData(user.schoolID, "schools"));
  const { data: marks} = useFetch(`/students/marks/single/${user._id}`);
  
  // Define columns for the GenericTable
  const columns = [
    { field: "name", label: "Subject Name" },
    { field: "marks", label: "Marks Obtained" },
    { field: "maxMarks", label: "Maximum Marks" },
    { field: "grade", label: "Grade" },
  ];

  // Prepare rows for the table
  const rows = marks?.marksData?.map((item) => {
    const isUnassigned = item.marks === null || item.marks === undefined;
    return {
      marks: isUnassigned ? '-' : item.marks,
      name: item.subjectName,
      maxMarks: isUnassigned ? '-' : 100, // Adjust if maxMarks is dynamic
      grade: isUnassigned
        ? '-'
        : item.marks >= 90
        ? 'A+'
        : item.marks >= 80
        ? 'A'
        : item.marks >= 70
        ? 'B'
        : 'C',
    };
  }) || [];

  return (
    <div className="marksheet-container">
      <h1 className="listTitle">Marks Obtained</h1>
      <div className="marks-table-container">
        <GenericTable columns={columns} rows={rows} rowKey="_id" />
      </div>
      {marks.allMarksPresent ?
        (<div>
          <h1>Marksheet</h1>
          <DownloadableCard
            subtitle="Final Examination Marksheet"
            type="marksheet"
            student={user}
            school={schoolData}
            tableData={marks}
            onDownloadName={`${user.name}_Marksheet.pdf`}
          />
        </div>) : (
          <div className="info-container">
            <InforBanner
              type="info"
              header="Marksheet Not Generated"
              description="Marksheet is not generated yet as all marks have not been released."
            ></InforBanner>
          </div>
        )
      }
    </div>
  )
}

export default Marksheet