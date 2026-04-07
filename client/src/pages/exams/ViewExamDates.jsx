import './viewExamDates.scss'

import { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { toast } from "react-toastify"

import { getClassExamDates } from '../../utils/endpoints/get';
import axiosInterceptor from '../../utils/shared/axiosInterceptor';
import { examColumns } from '../../utils/shared/constants';
import { checkSuccess } from '../../utils/shared/commons';

import DownloadableCard from '../../components/shared/downloadableCard/DownloadableCard';
import GenericTable from '../../components/shared/table/Table';
import InforBanner from "../../components/shared/infoBanner/InforBanner"
import Loader from '../../components/shared/loader/Loader';
import ExportButton from '../../components/shared/excelButton/ExcelButton.jsx';

const ViewExamDates = () => {

  const [data, setData] = useState([]);
  
  const { user } = useSelector(state => state.auth);
  const { info } = useSelector(state => state.school);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if(user) {
        try {
          setLoading(true);
          const response = await axiosInterceptor.get(getClassExamDates(user?.classID));
          if(checkSuccess(response.data.status)) {
            setData(response.data.data);
          }
        } catch (err) {
          toast.error(
            <div>
              <strong>Failed to fetch exam dates</strong>
              <div>{err.response?.data?.message || err.message || 'Unknown error'}</div>
            </div>
          );
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [user]);

  return (
    <div className='view-exam-dates-container'>
      {loading ? (
        <Loader text="Loading exam dates..." type="global"/>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 className="list-title" style={{ margin: 0 }}>Exam Dates</h1>
            {data?.examDates?.length > 0 && (
              <ExportButton
                data={data?.examDates}
                columns={examColumns}
                filename={`exam_dates_${data?.className || 'class'}`}
                sheetName="Exam Dates"
              />
            )}
          </div>
          <div className="exams-date-containers">
            <GenericTable
              columns={examColumns}
              rows={data?.examDates || []}
              rowKey="_id"
            />
          </div>

          {data?.allExamsPlanned ? (
            <div>
              <h1 className="list-title">Admit Card</h1>
              <DownloadableCard
                subtitle="School Examination Admit Card"
                type="admitcard"
                student={user}
                school={info}
                tableData={data}
                onDownloadName={`${user.name}_AdmitCard.pdf`}
              />
            </div>
          ) : (
            <div className="info-container">
              <InforBanner
                type="info"
                header="Admit Card Not Generated"
                description="Admin Card is not generated yet as all dates have not been released."
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ViewExamDates