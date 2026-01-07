import './viewExamDates.scss'

import { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { toast } from "react-toastify"

import { getClassExamDates, getSingleData } from '../../utils/endpoints/get';
import useFetch from '../../utils/service/useFetch';
import axiosInterceptor from '../../utils/shared/axiosInterceptor';
import { examColumns } from '../../utils/shared/constants';
import { checkSuccess } from '../../utils/shared/commons';

import DownloadableCard from '../../components/shared/downloadableCard/DownloadableCard';
import GenericTable from '../../components/shared/table/Table';
import InforBanner from "../../components/shared/infoBanner/InforBanner"

const ViewExamDates = () => {

  const [data, setData] = useState([]);
  
  const { user } = useSelector(state => state.auth);
  const { data: schoolData } = useFetch(getSingleData(user.schoolID, "schools"));

  useEffect(() => {
    const fetchData = async () => {
      if(user) {
        try {
          const response = await axiosInterceptor.get(getClassExamDates(user?.class));
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
        }
      }
    }
    fetchData();
  }, [user]);

  return (
    <div className='view-exam-dates-container'>
      <h1 className="list-title">Exam Dates</h1>
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
            school={schoolData}
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
            ></InforBanner>
          </div>
      )}
    </div>
  )
}

export default ViewExamDates