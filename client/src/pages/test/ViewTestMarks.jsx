import "./viewTestMarks.scss"

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

import useFetch from '../../utils/service/useFetch';
import { getSingleData, getStudentsOfClass } from '../../utils/endpoints/get';
import { formatDate } from '../../utils/shared/commons';
import { clearTestMarks } from "../../utils/endpoints/delete";
import { addTestMarks } from "../../utils/endpoints/put";
import axiosInterceptor from "../../utils/shared/axiosInterceptor";
import { testsConst } from "../../utils/shared/constants";
import { toast } from "react-toastify";
import InforBanner from "../../components/shared/infoBanner/InforBanner";

const ViewTestMarks = () => {
  const [stuData, setStuData] = useState([]);
  const [marksData, setMarksData] = useState({});

  const location = useLocation();
  
  const id = location.pathname.split("/")[4];
  const { data } = useFetch(getSingleData(id, testsConst))
  
  useEffect(() => {
    if (!data?.classID?._id) return;
    const fetchStudents = async() => {
      try {
        const response = await axiosInterceptor.get(getStudentsOfClass(data?.classID?._id));
        setStuData(response.data.data);
      }
      catch(error) {
        console.error("Error fetching student data:", error);
      }
    }
    fetchStudents();
  }, [data])

  const handleMarksChange = (studentId, value) => {
    setMarksData(prevMarksData => ({
      ...prevMarksData,
      [studentId]: {
        ...prevMarksData[studentId],
        value
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      const marksArray = Object.keys(marksData).map(studentId => ({
        student_id: studentId,
        value: marksData[studentId].value,
      }));

      console.log(marksArray)
      await axiosInterceptor.put(addTestMarks(id), { marksData: marksArray });
      toast.success("Test marks added successfully");
      window.location.reload();
    } catch (error) {
      const errorMessage =
          error.response?.data?.message ||
          "Failed to add test marks";
      toast.error(errorMessage);
      console.error("Error submitting marks:", error);
    }
  };

  const handleClearMarks = async () => {
    try {
      await axiosInterceptor.delete(clearTestMarks(id));
      setMarksData({})
      window.location.reload();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to clear marks. Please try again.";
      toast.error(errorMessage);
      console.error("Error clearing marks:", error);
    }
  };

  return (
    <div className='view-test-marks'>
        <div className="view-test-marks-container">
          <div className="upper-container">
              <div className="test-info-container">
              <h3 className="mTitle">{data?.name}</h3>
              <p><span>Syllabus</span> : {data?.syllabus}</p>
              <p><span>Duration</span> : {data?.duration} min</p>
              <p><span>Marks</span>: {data?.totalMarks}</p> 
              <p><span>Date</span> : {formatDate(data?.date)}</p>
              <p><span>Assigned To</span> : {data?.classID?.name}</p>
              <p><span>Subject</span>: {data?.subject?.name}</p>
              <p><span>Assigned By</span>: {data?.author?.teachername}</p> 
            </div>
            {data.marks && data.marks.length > 0 && (
              <div className="button-container">
                <button>Edit Marks</button>
                <button onClick={handleClearMarks}>Clear Marks</button>
              </div>
            )}
            
          </div>
          {data?.state === "completed" ? (
            <div className="lower-container">
            {data?.marks && data?.marks?.length > 0 ? (
              <div className="marks-adding-table">
                <div className="marks-row" id='title-row'>
                  <div className="marks-col">Enrollment Number</div>
                  <div className="marks-col">Student</div>
                  <div className="marks-col">Present</div>
                  <div className="marks-col">Marks</div>
                </div>
                {data?.marks?.map((mark, index) => (
                  <div className="marks-row" key={index}>
                    <div className="marks-col">{mark.student_id.enroll}</div>
                    <div className="marks-col">{mark.student_id.name}</div>
                    <div className="marks-col">{mark.present ? "Yes" : "No"}</div>
                    <div className="marks-col">{mark.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="marks-adding-table">
                <div className="marks-row" id='title-row'>
                  <div className="marks-col">Enrollment Number</div>
                  <div className="marks-col">Student</div>
                  <div className="marks-col">Marks</div>
                </div>
                {stuData && stuData?.map((student, index) => (
                  <div className="marks-row" key={index}>
                    <div className="marks-col">{student?.enroll}</div>
                    <div className="marks-col">{student?.name}</div>
                    <div className="marks-col">
                      <input type="number" name="marks" min="0" max="100"
                        onChange={(e) => handleMarksChange(student?._id, e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!(data?.marks && data?.marks?.length > 0) && (
              <div className="add-marks-button">
                <button onClick={handleSubmit}>Add Marks</button>
              </div>
            )}
          </div>) : (
            <InforBanner
              type="error"
              header="Test Cancelled"
              description="This test has been marked as cancelled. You cannot add or edit marks for a cancelled test."
            ></InforBanner>
          )}
        </div>
    </div>
  )
}

export default ViewTestMarks