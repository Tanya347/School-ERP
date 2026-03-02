import './marksheet.scss'

import { useSelector } from "react-redux";

import useFetch from '../../utils/service/useFetch';
import { marksColumns } from "../../utils/shared/constants";
import { getMarksOfStudent } from '../../utils/endpoints/get';

import DownloadableCard from '../../components/shared/downloadableCard/DownloadableCard';
import GenericTable from '../../components/shared/table/Table';
import InforBanner from '../../components/shared/infoBanner/InforBanner';
import Loader from '../../components/shared/loader/Loader';

const Marksheet = () => {

  const { user } = useSelector(state => state.auth);
  const { info } = useSelector(state => state.school);
  const { data: marks, loading} = useFetch(getMarksOfStudent(user._id));

  // Prepare rows for the table
  const rows = marks?.marksData?.map((item) => {
    const isUnassigned = item.marks === null || item.marks === undefined;
    return {
      marks: isUnassigned ? '-' : item.marks,
      name: item.subjectName,
      maxMarks: isUnassigned ? '-' : 100,
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
      {loading ? (
        <Loader text="Loading data..." type="global"/>
      ) : (
        <>
          <h1 className="list-title">Marks Obtained</h1>
          <div className="marks-table-container">
            <GenericTable columns={marksColumns} rows={rows} rowKey="_id" />
          </div>
          {marks.allMarksPresent ? (
            <div className='marksheet-pdf-container'>
              <h1>Marksheet</h1>
              <DownloadableCard
                subtitle="Final Examination Marksheet"
                type="marksheet"
                student={user}
                school={info}
                tableData={marks}
                onDownloadName={`${user.name}_Marksheet.pdf`}
              />
            </div>
          ) : (
            <div className="info-container">
              <InforBanner
                type="info"
                header="Marksheet Not Generated"
                description="Marksheet is not generated yet as all marks have not been released."
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Marksheet
