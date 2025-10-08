  import { useEffect, useState } from 'react'
import './viewExamDates.scss'
import { useAuth } from '../../config/context/AuthContext';
import axios from 'axios';
import { getSingleData } from '../../config/endpoints/get';
import useFetch from '../../config/service/useFetch';
import DownloadableCard from '../../components/downloadableCard/DownloadableCard';
import GenericTable from '../../components/table/Table';

const ViewExamDates = () => {
  const {user} = useAuth();
  const [data, setData] = useState([]);
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
      <GenericTable
        columns={columns}
        rows={data?.examDates || []}
        rowKey="_id"
      />

      {data?.allExamsPlanned && (
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
      )}
    </div>
  )
}

export default ViewExamDates