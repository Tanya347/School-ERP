import React from 'react'
import './studentCategory.scss'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import useFetch from '../../hooks/useFetch';

const StudentCategory = () => {

    const {data} = useFetch('/clusters')

    const category = [
        "beginner",
        "intermediate",
        "advanced"
    ]

    console.log(data)
  return (
    <div className='studentCategory'>
        <TableContainer component={Paper} className="table">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead style={{"backgroundColor": "#EEEEEE"}}>

                {/* Column Names */}
                <TableRow>
                    <TableCell className="tableCell" style={{"fontWeight": "bold"}}>Category</TableCell>
                    <TableCell className="tableCell" style={{"fontWeight": "bold"}}>Name</TableCell>
                </TableRow>
                </TableHead>


                <TableBody>
                {data?.map((row) => (

                    // row.id is just a number
                    <TableRow key={row.id}>
                    
                    {/* Event poster and name */}
                    {/* <TableCell className="tableCell">
                        <div className="cellWrapper">
                        <img src={row.profilePicture || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"} alt="avatar" className="image" />
                        {row.name}
                        </div>
                    </TableCell> */}

                    {/* Other details */}
                    <TableCell className="tableCell">{category[row?.predicted_cluster]}</TableCell>
                    <TableCell className="tableCell">{row?.student_id?.name}</TableCell>
                    
                    {/* Can be used to show some kind of status */}
                    
                    {/* <TableCell className="tableCell">
                        <span className={`status ${row.status}`}>{row.status}</span>
                    </TableCell> */}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
  )
}

export default StudentCategory