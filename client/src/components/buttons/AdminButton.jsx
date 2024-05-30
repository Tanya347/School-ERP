import React from 'react'
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BookIcon from '@mui/icons-material/Book';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SchoolIcon from '@mui/icons-material/School';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import { Link } from 'react-router-dom';

import "./adminButton.scss"

const Button = () => {
  return (
    <div className='adminButton'>
      <h2>Create</h2>
      <div className="flexContainer">
        <Link to="/admin/students/new" style={{ textDecoration: "none", color: "black"  }}>
          <div className="createButton">
            <PersonAddIcon className='icon' style={{color:"var(--turquoise)"}}/>
            <p>Student</p>
          </div>
        </Link >
        <Link to="/admin/faculties/new" style={{ textDecoration: "none", color: "black"  }}>
          <div className="createButton">
            <GroupAddIcon className='icon' style={{color:"var(--orange)"}}/>
            <p>Faculty</p>
          </div>
        </Link>
        <Link to="/admin/courses/new" style={{ textDecoration: "none", color: "black"  }}>
          <div className="createButton">
            <BookIcon className='icon' style={{color:"var(--red)"}}/>
            <p>Subject</p>
          </div>
        </Link>
        <Link to="/admin/timetables/new" style={{ textDecoration: "none", color: "black" }}>
          <div className="createButton">
            <MoreTimeIcon className='icon' style={{color:"var(--green)"}}/>
            <p>Timetable</p>
          </div>
        </Link>
        <Link to="/admin/events/new" style={{ textDecoration: "none", color: "black" }}>
          <div className="createButton">
            <CalendarMonthIcon className='icon' style={{color:"var(--green)"}}/>
            <p>Events</p>
          </div>
        </Link>
        <Link to="/admin/updates/new" style={{ textDecoration: "none", color: "black"  }}>
          <div className="createButton">
            <NotificationAddIcon className='icon' style={{color:"var(--pink)"}}/>
            <p>Updates</p>
          </div>
        </Link>
        <Link to="/admin/classes" style={{ textDecoration: "none", color: "black"  }}>
          <div className="createButton">
            <SchoolIcon className='icon' style={{color:"var(--pink)"}}/>
            <p>Classes</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Button