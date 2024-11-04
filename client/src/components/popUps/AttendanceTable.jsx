import React from 'react'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import CancelIcon from '@mui/icons-material/Cancel';
import useFetch from "../../config/service/useFetch"
import axios from "axios";
import "./attendanceTable.scss"
import { getAttendanceStatusByDate } from '../../config/endpoints/get';
import { getClearDayAttendance } from '../../config/endpoints/delete';
import { toast } from "react-toastify"


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
    <div className="attendanceModal">
        <div className="attContainer">

            {/* setOpen set to false so that pop up closes */}
            <CancelIcon
                    className="attClose"
                    onClick={() => setOpen(false)}
                />

        <div className='attendance-status'>
            <TableContainer component={Paper} className="table" >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead style={{"backgroundColor": "#EEEEEE"}}>

                    {/* Column Names */}
                    <TableRow>
                        <TableCell className="tableCell" style={{"fontWeight": "bold"}}>Name</TableCell>
                        <TableCell className="tableCell" style={{"fontWeight": "bold"}}>Enrollment Number</TableCell>
                        <TableCell className="tableCell" style={{"fontWeight": "bold"}}>Status</TableCell>
                    </TableRow>
                    </TableHead>


                    <TableBody>
                    {data?.map((row) => (

                        // row.id is just a number
                        <TableRow key={row.id}>
                        

                        {/* Other details */}
                        <TableCell className="tableCell">{row.enroll}</TableCell>
                        <TableCell className="tableCell">{row.name}</TableCell>
                        <TableCell className="tableCell">
                            <span className={`status ${row.status}`}>{row.status}</span>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

        <div className="clear-button">
            <button onClick={handleClear}>Clear Attendance</button>
        </div>
        </div>
    </div>
  )
}

export default AttendanceTable