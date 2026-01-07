import "./attendanceTable.scss";

import { toast } from "react-toastify";

import Popup from "../shared/popup/Popup";
import GenericTable from "../shared/table/Table";

import axiosInterceptor from "../../utils/shared/axiosInterceptor";
import useFetch from "../../utils/service/useFetch";

import { getAttendanceStatusByDate } from "../../utils/endpoints/get";
import { getClearDayAttendance } from "../../utils/endpoints/delete";
import { attendanceColumns } from "../../utils/shared/constants";
import { checkSuccess } from "../../utils/shared/commons";

const AttendanceTable = ({ classid, date, setOpen, id, refreshTrigger }) => {
  const { data = [] } = useFetch(
    getAttendanceStatusByDate(classid, date)
  );

  const handleClear = async () => {
    try {
      const res = await axiosInterceptor.delete(
        getClearDayAttendance(id)
      );

      if (checkSuccess(res.data.status)) {
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
    <Popup
      title={`Attendance — ${date}`}
      onClose={() => setOpen(false)}
      customClass="attendance-modal"
      content={
        <GenericTable
          columns={attendanceColumns}
          rows={data}
          rowKey="id"
          customStyles={{
            head: { backgroundColor: "#EEEEEE" },
          }}
        />
      }
      actions={[
        {
          label: "Clear Attendance",
          onClick: handleClear,
          disabled: data.length === 0,
        },
      ]}
    />
  );
};

export default AttendanceTable;