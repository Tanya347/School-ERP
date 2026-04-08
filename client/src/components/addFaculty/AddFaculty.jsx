import './addFaculty.scss'

import CancelIcon from '@mui/icons-material/Cancel';
import { Tooltip } from '@mui/material';

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"

import useFetch from '../../utils/service/useFetch.js';
import { getSingleData } from '../../utils/endpoints/get.js';
import axiosInterceptor from '../../utils/shared/axiosInterceptor.js';
import { somethingWentWrongMsg, coursesConst } from "../../utils/shared/constants.js"
import { checkSuccess } from '../../utils/shared/commons.js';

import Popup from '../shared/popup/Popup.jsx';

const AddFaculty = ({ setOpen, courseId }) => {

    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Fetch all faculties
    const { data: faculties, loading: loadingFaculties } = useFetch('/faculties');

    // Fetch current course data
    const { data: courseData, loading: loadingCourse } = useFetch(getSingleData(courseId, coursesConst));

    const handleClick = async (e) => {
        e.preventDefault();
        if (!selectedFaculty) {
            toast.error("Please select a faculty");
            return;
        }

        try {
            setLoading(true);
            const res = await axiosInterceptor.patch(
                `/faculties/changeCourseFaculty/${courseId}/${selectedFaculty}`
            );

            if (checkSuccess(res.data.status)) {
                toast.success("Faculty assigned to course successfully!");
                setOpen(false);
                navigate(0); // Refresh the page to show updated data
            }
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || somethingWentWrongMsg;
            toast.error(errorMessage);
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFaculty = async () => {
        try {
            setLoading(true);
            // Unassign faculty by calling removeCourseFromFaculty
            const facultyId = courseData?.teacher?._id;
            if (!facultyId) {
                toast.error("No faculty assigned to this course");
                return;
            }

            const res = await axiosInterceptor.patch(
                `/faculties/removeCourse/${facultyId}/${courseId}`
            );

            if (checkSuccess(res.data.status)) {
                toast.success("Faculty removed from course successfully!");
                setOpen(false);
                navigate(0);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to remove faculty";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Filter faculties based on search query
    const filteredFaculties = faculties?.filter(faculty =>
        faculty.teachername?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faculty.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faculty.username?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const currentFaculty = courseData?.teacher;

    return (
        <Popup
            title="Assign Faculty to Course"
            content={
                <div className="add-faculty">
                    {/* Current Faculty Section */}
                    {currentFaculty && (
                        <div className="current-faculty">
                            <h4>Currently Assigned Faculty</h4>
                            <div className="faculty-item">
                                <div>
                                    <strong>{currentFaculty.teachername}</strong>
                                </div>
                                <Tooltip title="Remove Faculty" arrow>
                                    <CancelIcon
                                        className="remove-btn"
                                        onClick={handleRemoveFaculty}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    )}

                    <h4>Assign New Faculty</h4>

                    {/* Search Input */}
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search faculty by name, email or username..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* Faculty List */}
                    <div className="faculty-list">
                        {loadingFaculties ? (
                            <p>Loading faculties...</p>
                        ) : filteredFaculties?.length === 0 ? (
                            <p className="empty">No faculties found</p>
                        ) : (
                            filteredFaculties.map(faculty => (
                                <div
                                    key={faculty._id}
                                    className={`faculty-option ${selectedFaculty === faculty._id ? 'selected' : ''}`}
                                    onClick={() => setSelectedFaculty(faculty._id)}
                                >
                                    <div className="faculty-info">
                                        {faculty.teachername}
                                    </div>
                                    {selectedFaculty === faculty._id && <span className="check-mark">✓</span>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            }
            actions={[
                { label: loading ? 'Assigning...' : 'Assign Faculty', onClick: handleClick }
            ]}
            onClose={() => setOpen(false)}
        />
    );
};

export default AddFaculty
