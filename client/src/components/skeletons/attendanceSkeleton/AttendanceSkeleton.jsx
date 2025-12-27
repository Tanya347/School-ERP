import "./attendanceSkeleton.scss";

const AttendanceSkeleton = () => {
  return (
    <div className="attendance-skeleton">
      <div className="skeleton title"></div>
      <div className="circle"></div>
      <div className="skeleton line"></div>
      <div className="skeleton line small"></div>
    </div>
  );
};

export default AttendanceSkeleton;
