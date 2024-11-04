import React from 'react'
import AddTaskIcon from '@mui/icons-material/AddTask';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AddchartIcon from '@mui/icons-material/Addchart';
import { Link } from 'react-router-dom';

import "./facultyButton.scss"

const FacultyButton = () => {
  return (
    <div className='adminButton'>
      <h2>Create</h2>
      <div className="flexContainer">
        <Link to="/faculty/attendance/new" style={{ textDecoration: "none", color: "black"  }}>
          <div className="createButton">
            <PlaylistAddIcon className='icon' style={{color:"var(--turquoise)"}}/>
            <p>Attendance</p>
          </div>
        </Link >
        <Link to="/faculty/tasks/new" style={{ textDecoration: "none", color: "black"  }}>
          <div className="createButton">
            <AddTaskIcon className='icon' style={{color:"var(--red)"}}/>
            <p>Tasks</p>
          </div>
        </Link>
        <Link to="/faculty/tests/new" style={{ textDecoration: "none", color: "black" }}>
          <div className="createButton">
            <NoteAddIcon className='icon' style={{color:"var(--green)"}}/>
            <p>Tests</p>
          </div>
        </Link>
        <Link to="/faculty/marks/new" style={{ textDecoration: "none", color: "black"  }}>
          <div className="createButton">
            <AddchartIcon className='icon' style={{color:"var(--pink)"}}/>
            <p>Marks</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default FacultyButton