import './viewExamDates.scss'

import { useEffect, useState } from 'react'
import axios from 'axios';

import { useAuth } from '../../config/context/AuthContext';
import { getSingleData } from '../../config/endpoints/get';
import useFetch from '../../config/service/useFetch';

import DownloadableCard from '../../components/downloadableCard/DownloadableCard';
import GenericTable from '../../components/shared/table/Table';
import InforBanner from "../../components/shared/infoBanner/InforBanner"

const ViewExamDates = () => {

  const [data, setData] = useState([]);
  
  const {user} = useAuth();
  const { data: schoolData } = useFetch(getSingleData(user.schoolID, "schools"));

  useEffect(() => {
    const fetchData = async () => {
      if(user) {
        try {
          const response = await axios.get(process.env.REACT_APP_API_URL + `/courses/exam/${user?.class}`, {withCredentials: true});
          if(response.data.status === "success") {
            setData(response.data.data);
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchData();
  }, [user]);

  const columns = [
    { field: "name", label: "Subject" },
    { field: "code", label: "Code" },
    { field: "teacherName", label: "Teacher" },
    {
      field: "examDate",
      label: "Exam Date",
      render: (value) =>
        value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "",
    },
  ];

  return (
    <div className='view-exam-dates-container'>
      <h1 className="listTitle">Exam Dates</h1>
      <div className="exams-date-containers">
        <GenericTable
          columns={columns}
          rows={data?.examDates || []}
          rowKey="_id"
        />
      </div>

      {data?.allExamsPlanned ? (
        <div>
          <h1 className="listTitle">Admit Card</h1>
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