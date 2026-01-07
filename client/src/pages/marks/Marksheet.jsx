import './marksheet.scss'

import { useSelector } from "react-redux";

import { getSingleData } from '../../utils/endpoints/get';
import useFetch from '../../utils/service/useFetch';
import { marksColumns, schoolsConst } from "../../utils/shared/constants";

import DownloadableCard from '../../components/shared/downloadableCard/DownloadableCard';
import GenericTable from '../../components/shared/table/Table';
import InforBanner from '../../components/shared/infoBanner/InforBanner';

const Marksheet = () => {

  const { user } = useSelector(state => state.auth);
  
  const { data: schoolData } = useFetch(getSingleData(user.schoolID, schoolsConst));
  const { data: marks} = useFetch(`/students/marks/single/${user._id}`);

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
      <h1 className="list-title">Marks Obtained</h1>
      <div className="marks-table-container">
        <GenericTable columns={marksColumns} rows={rows} rowKey="_id" />
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