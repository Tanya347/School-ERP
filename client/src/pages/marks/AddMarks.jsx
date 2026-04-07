import "./addMarks.scss";

import { useNavigate, useParams } from "react-router-dom";
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
  const [stuData, setStuData] = useState([]);
  const [marksData, setMarksData] = useState({});

  const { courseId } = useParams();
  const navigate = useNavigate();

  const courses = useSelector(state => state.faculty.courses);
  const currentCourse = courses?.find(c => c._id === course);

  // Set course from URL param when courses load
  useEffect(() => {
    if (courseId && courses?.length > 0) {
      const selectedCourse = courses.find(c => c._id === courseId);
      if (selectedCourse) {
        setCourse(selectedCourse._id);
        setCourseName(selectedCourse.subjectCode);
        setSclass(selectedCourse.classID?._id);
      }
    }
  }, [courseId, courses]);

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
    navigate(`/faculty/marks/new/${cl._id}`);
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

  const renderContent = () => {
    // Case 1: No course selected
    if (!course) {
      return <h1>Please select a course</h1>;
    }

    // console.log(course)
    console.log(currentCourse)

    // Case 2: Exam not completed
    if (currentCourse?.examStatus?.status !== "completed") {
      return (
        <div className="no-students">
          <InforBanner
            type="info"
            header={`Marks cannot be added for ${currentCourse?.subjectCode}`}
            description="This exam is not completed yet. Marks can only be added once the exam status is marked as completed."
          />
        </div>
      );
    }

    // Case 3: No students in class
    if (!stuData || stuData.length === 0) {
      return (
        <div className="no-students">
          <InforBanner
            type="error"
            header="Empty List"
            description="No students present for this class"
          />
        </div>
      );
    }

    return (
      <>
        <h1>Course: {courseName}</h1>
        <div className="marks-adding-table">
          <div className="marks-row" id="title-row">
            <div className="marks-col">Enrollment Number</div>
            <div className="marks-col">Student</div>
            <div className="marks-col">Marks</div>
          </div>
          {stuData?.map((st) => (
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
            {sending && <Loader text="adding marks.." />}
            <button onClick={handleSubmit}>Add Marks</button>
          </div>
        </div>
      </>
    );
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

        {renderContent()}
      </div>
    </div>
  );
};

export default AddMarks;
