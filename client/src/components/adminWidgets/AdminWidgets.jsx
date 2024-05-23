import React from 'react'
import './adminWidgets.scss'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import useFetch from '../../config/hooks/useFetch';
import { getAllCount } from '../../source/endpoints/get';

const AdminWidgets = () => {

    const {data} = useFetch(getAllCount)

  return (
    <div className="AdminWidgets">
        <div className='widget' style={{"backgroundColor":"var(--light-blue)"}}>
            <div className="leftContainer">
                <SchoolIcon className='icon'/>
            </div>
            <div className="rightContainer">
                <h4>Students</h4>
                <h3>{data.student}</h3>
            </div>
        </div>
        <div className='widget' style={{"backgroundColor":"var(--light-pink)"}}>
            <div className="leftContainer">
                <EmojiPeopleIcon className='icon'/>
            </div>
            <div className="rightContainer">
                <h4>Teachers</h4>
                <h3>{data.teacher}</h3>
            </div>
        </div>
        <div className='widget' style={{"backgroundColor":"var(--light-yellow)"}}>
            <div className="leftContainer" >
                <LibraryBooksIcon className='icon'/>
            </div>
            <div className="rightContainer">
                <h4>Subjects</h4>
                <h3>{data.subject}</h3>
            </div>
        </div>
        <div className='widget' style={{"backgroundColor":"var(--light-green)"}}>
            <div className="leftContainer">
                <PeopleIcon className='icon'/>
            </div>
            <div className="rightContainer">
                <h4>Classes</h4>
                <h3>{data.class}</h3>
            </div>
        </div>
    </div>
  )
}

export default AdminWidgets