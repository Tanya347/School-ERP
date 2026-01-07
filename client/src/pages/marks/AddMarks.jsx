import "./addMarks.scss";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { getMarksOfSubject, getStudentsOfClass } from "../../utils/endpoints/get";
import { addMarks } from "../../utils/endpoints/put";
import axiosInterceptor from "../../utils/shared/axiosInterceptor";
import { checkSuccess } from "../../utils/shared/commons";

import Loader from "../../components/shared/loader/Loader"
import InforBanner from "../../components/shared/infoBanner/InforBanner";

const AddMarks = () => {
  const [sending, setSending] = useState(false);
  const [course, setCourse] = useState("");
  const [sclass, setSclass] = useState("");
  const [courseName, setCourseName] = useState("");
  const [stuData, setStuData] = useState({});
  const [marksData, setMarksData] = useState({});

  const navigate = useNavigate();

  const courses = useSelector(state => state.faculty.courses);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!sclass) return;

      try {
        const response = await axiosInterceptor.get(getStudentsOfClass(sclass));
        setStuData(response.data.data);
      } catch (error) {
        toast.error(
          <div>
            <strong>Error fetching student data</strong>
            <div>{error.response?.data?.message || error.message || 'Unknown error'}</div>
          </div>
        );
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudents();
  }, [sclass]);

  useEffect(() => {
    const fetchMarks = async () => {
      if (!course) return;

      try {
        const response = await axiosInterceptor.get(getMarksOfSubject(course));

        const prefilledMarks = {};
        response.data.data.forEach((entry) => {
          prefilledMarks[entry._id] = entry.marks || "";
        });

        setMarksData(prefilledMarks);
      } catch (error) {
        toast.error(
          <div>
            <strong>Error fetching marks data</strong>
            <div>{error.response?.data?.message || error.message || 'Unknown error'}</div>
          </div>
        );
        console.error("Error fetching marks data:", error);
      }
    };

    fetchMarks();
  }, [course]);

  const handleClick = (cl) => {
    setCourse(cl._id);
    setCourseName(cl.subjectCode);
    setSclass(cl.sclass);
  };

  const handleMarksChange = (studentId, marks) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: marks,
    }));
  };

  const handleSubmit = async () => {
    setSending(true);
    try {
      const formattedMarksData = Object.entries(marksData).map(
        ([studentId, marks]) => ({
          studentId,
          marks,
        })
      );

      const res = await axiosInterceptor.put(addMarks(course), {
        marksData: formattedMarksData,
      });

      if (checkSuccess(res.data.status)) {
        toast.success("Marks added successfully!");
        navigate("/faculty/marks");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to add marks. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="add-marks">
      <h1>Add Marks</h1>
      <p>Manage and track final marks for your courses</p>

      <div className="add-marks-container">
        <div className="classes-button">
          {courses?.map((cr) => (
            <button
              key={cr._id}
              onClick={() => handleClick(cr)}
              className={course === cr._id ? "selected-course" : ""}
            >
              {cr.subjectCode} {cr.name}
            </button>
          ))}
        </div>

        {course ? (
          <>
            <h1>Course: {courseName}</h1>

            {stuData?.students?.length > 0 ? (<div className="marks-adding-table">
              <div className="marks-row" id="title-row">
                <div className="marks-col">Enrollment Number</div>
                <div className="marks-col">Student</div>
                <div className="marks-col">Marks</div>
              </div>
                {stuData?.students?.map((st) => (
                  <div className="marks-row" key={st._id}>
                    <div className="marks-col">{st.enroll}</div>
                    <div className="marks-col">{st.name}</div>
                    <div className="marks-col">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={marksData[st._id] || ""}
                        onChange={(e) =>
                          handleMarksChange(st._id, e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
            <div className="add-marks-button">
              {sending && <Loader text="adding marks.."/>}
              <button onClick={handleSubmit}>Add Marks</button>
            </div>
            </div>
            ) : (
              <div className="no-students">
                <InforBanner
                  type="error"
                  header="Empty List"
                  description="No students present for this class"
                ></InforBanner>
              </div>
            )}

          </>
        ) : (
          <h1>Please select a course</h1>
        )}
      </div>
    </div>
  );
};

export default AddMarks;
