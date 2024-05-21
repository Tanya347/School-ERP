import React from 'react'
import AddTaskIcon from '@mui/icons-material/AddTask';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AddchartIcon from '@mui/icons-material/Addchart';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNext';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Link } from 'react-router-dom';

import "./facultyButton.scss"

const FacultyButton = () => {
  return (
    <div className='adminButton'>
      <h2>Create</h2>
      <div className="flexContainer">
        <Link to="/attendance/new" style={{ textDecoration: "none", color: "black"  }}>
          <div className="createButton">
            <PlaylistAddIcon className='icon' style={{color:"var(--turquoise)"}}/>
            <p>Attendance</p>
          </div>
        </Link >
        <Link to="/material/new" style={{ textDecoration: "none", color: "black"  }}>
          <div className="createButton">
            <PostAddIcon className='icon' style={{color:"var(--orange)"}}/>
            <p>Material</p>
          </div>
        </Link>
        <Link to="/facTasks/new" style={{ textDecoration: "none", color: "black"  }}>
          <div className="createButton">
            <AddTaskIcon className='icon' style={{color:"var(--red)"}}/>
            <p>Tasks</p>
          </div>
        </Link>
        <Link to="/facTests/new" style={{ textDecoration: "none", color: "black" }}>
          <div className="createButton">
            <NoteAddIcon className='icon' style={{color:"var(--green)"}}/>
            <p>Tests</p>
          </div>
        </Link>
        <Link to="/marks/new" style={{ textDecoration: "none", color: "black"  }}>
          <div className="createButton">
            <AddchartIcon className='icon' style={{color:"var(--pink)"}}/>
            <p>Marks</p>
          </div>
        </Link>
        <Link to="/facVideo/new" style={{ textDecoration: "none", color: "black"  }}>
          <div className="createButton">
            <QueuePlayNextIcon className='icon' style={{color:"var(--pink)"}}/>
            <p>Videos</p>
          </div>
        </Link>
        
        {/* <div className="createButton">
          <ControlPointDuplicateIcon className='icon' style={{color:"var(--blue)"}}/>
          <p>Classes</p>
        </div> */}
      </div>
    </div>
  )
}

export default FacultyButton