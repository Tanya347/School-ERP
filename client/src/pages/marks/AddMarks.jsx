import { useEffect, useState } from 'react'
import "./addMarks.scss"

import { useAuth } from '../../config/context/AuthContext'
import useFetch from '../../config/service/useFetch'
import { getFacultyData } from '../../config/endpoints/get'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { addMarks } from '../../config/endpoints/put'
import { toast } from 'react-toastify'


const AddMarks = () => {

  const { user } = useAuth();
  const courses = useFetch(getFacultyData(user._id, "courses")).data
  const [course, setCourse ]= useState("");
  const [sclass, setSclass] = useState("");
  const [courseName, setCourseName] = useState("");
  const [stuData, setStuData] = useState({});
  const [marksData, setMarksData] = useState({});


  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      if (sclass) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes/students/${sclass}`);
          setStuData(response.data.data);
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      }
    };
    fetchStudents();
  }, [sclass])

  useEffect(() => {
    const fetchMarks = async () => {
      if (course) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/students/marks/subject/${course}`);
          const data = response.data.data;

          // Populate marks data if available
          const prefilledMarks = {};
          data.forEach((entry) => {
            prefilledMarks[entry._id] = entry.marks || "";
          });
          setMarksData(prefilledMarks);
        } catch (error) {
          console.error("Error fetching marks data:", error);
        }
      }
    };
    fetchMarks();
  }, [course])

  const handleClick = (cl) => {
    setCourse(cl._id);
    setCourseName(cl.subjectCode);
    setSclass(cl.sclass)
  };
  
  const handleMarksChange = (studentId, marks) => {
    setMarksData((prevMarksData) => ({
      ...prevMarksData,
      [studentId]: marks,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formattedMarksData = Object.entries(marksData).map(([studentId, marks]) => ({
        studentId,
        marks,
      }));

      const res = await axios.put(addMarks(course), {
        marksData: formattedMarksData,
      });

      if(res.data.status === "success") {
        toast.success("Marks added successfully!")
        navigate('/faculty/marks');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to add marks. Please try again.`;
        toast.error(errorMessage);
        console.error(err);
        return err;
    }
  };

  return (
    <div className='add-marks'>
      <div className="add-marks-container">
        <div className="classes-button">
          {
            courses?.map((cl, index) => (
              <button key={index} onClick={() => handleClick(cl)}>{cl.subjectCode}</button>
            ))
          }
        </div>
        {course ? (
          <>
            <h1>Course: {courseName}</h1>

            
                  <div className="marks-adding-table">
              <div className="marks-row" id='title-row'>
                <div className="marks-col">Enrollment Number</div>
                <div className="marks-col">Student</div>
                <div className="marks-col">Marks</div>
              </div>
          
              {stuData?.students?.map((st, index) => (
                <div className="marks-row" key={index}>
                  <div className="marks-col">{st.enroll}</div>
                  <div className="marks-col">{st.name}</div>
                  <div className="marks-col">
                    <input
                      type="number"
                      name="marks"
                      id="marks"
                      min="0"
                      max="100"
                      value={marksData[st._id] || ""}
                      onChange={(e) => handleMarksChange(st._id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="add-marks-button">
              <button onClick={handleSubmit}>Add Marks</button>
            </div>
          </>
        ) : (
          <>
            <h1>Please select a course</h1>
          </>
        )}
      </div>
    </div>
  )
}

export default AddMarks