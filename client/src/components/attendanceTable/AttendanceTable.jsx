import "./attendanceTable.scss";

import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";

import axiosInterceptor from "../../config/utils/axiosInterceptor";
import useFetch from "../../config/service/useFetch";

import { getAttendanceStatusByDate } from "../../config/endpoints/get";
import { getClearDayAttendance } from "../../config/endpoints/delete";
import { successMsg, attendanceColumns } from "../../config/utils/constants";

import GenericTable from "../shared/table/Table";

const AttendanceTable = ({ classid, date, setOpen, id, refreshTrigger }) => {
  const { data = [] } = useFetch(
    getAttendanceStatusByDate(classid, date)
  );

  const handleClear = async () => {
    try {
      const res = await axiosInterceptor.delete(
        getClearDayAttendance(id)
      );

      if (res.data.status === successMsg) {
        toast.success("Attendance has been cleared!");
        refreshTrigger((prev) => prev + 1);
      }

      setOpen(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to clear attendance. Please try again."
      );
    }
  };

  return (
    <div className="attendance-modal">
      <div className="att-container">
        <CancelIcon
          className="att-close"
          onClick={() => setOpen(false)}
        />

        <div className="attendance-status">
          <GenericTable
            columns={attendanceColumns}
            rows={data}
            rowKey="id"
            customStyles={{
              head: { backgroundColor: "#EEEEEE" },
            }}
          />
        </div>

        <div className="clear-button">
          <button onClick={handleClear}>Clear Attendance</button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;
