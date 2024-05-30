import React from 'react'
import './studentClass.scss'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StudentClass = ({props}) => {

  return (
    <div className='studentClass'>
        <TableContainer component={Paper} className="table">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead style={{"backgroundColor": "#EEEEEE"}}>

                {/* Column Names */}
                <TableRow>
                    <TableCell className="tableCell" style={{"fontWeight": "bold"}}>Name</TableCell>
                    <TableCell className="tableCell" style={{"fontWeight": "bold"}}>Enrollment Number</TableCell>
                    <TableCell className="tableCell" style={{"fontWeight": "bold"}}>Gender</TableCell>
                    <TableCell className="tableCell" style={{"fontWeight": "bold"}}>Email</TableCell>
                    <TableCell className="tableCell" style={{"fontWeight": "bold"}}>Phone</TableCell>
                    <TableCell className="tableCell" style={{"fontWeight": "bold"}}>Attendance</TableCell>

                </TableRow>
                </TableHead>


                <TableBody>
                {props?.map((row) => (

                    // row.id is just a number
                    <TableRow key={row.id}>
                    
                    {/* Event poster and name */}
                    <TableCell className="tableCell">
                        <div className="cellWrapper">
                        <img src={row.profilePicture || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"} alt="avatar" className="image" />
                        {row.name}
                        </div>
                    </TableCell>

                    {/* Other details */}
                    <TableCell className="tableCell">{row?.enroll}</TableCell>
                    <TableCell className="tableCell">{row?.gender}</TableCell>
                    <TableCell className="tableCell">{row?.email}</TableCell>
                    <TableCell className="tableCell">{row?.studentPhone}</TableCell>
                    <TableCell className="tableCell">{row?.attendancePercentage} %</TableCell>


                    
                    {/* Can be used to show some kind of status */}
                    

                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
  )
}

export default StudentClass