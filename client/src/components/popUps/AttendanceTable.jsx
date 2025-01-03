import React from 'react'
import useFetch from "../../config/service/useFetch"
import axios from "axios";
import "./attendanceTable.scss"
import { getAttendanceStatusByDate } from '../../config/endpoints/get';
import { getClearDayAttendance } from '../../config/endpoints/delete';
import { toast } from "react-toastify"
import GenericTable from '../table/Table';
import { attendanceColumns } from '../../config/tableSource/attendanceColumns';
import Popup from './Popup';


const AttendanceTable = ({classid, date, setOpen, id}) => {

    const {data} = useFetch(getAttendanceStatusByDate(classid, date));
    
    const handleClear = async() => {
        // this deletes data from the database
        try {
            const res = await axios.delete(getClearDayAttendance(id), { withCredentials: true });
            if(res.data.status === 'success') {
                toast.success("Attendance has been cleared!");
            }
            setOpen(false)
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to clear attendance. Please try again.";
            toast.error(errorMessage);
            console.error(err);
            return err;
        }
    }

  return (
    <Popup
        title="Attendance Details"
        content={<GenericTable columns={attendanceColumns} rows={data || []} rowKey="id" />}
        actions={[
            { label: "Clear Attendance", onClick: handleClear },
        ]}
        onClose={() => setOpen(false)}
    />
  )
}

export default AttendanceTable