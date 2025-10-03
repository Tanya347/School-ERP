import React from 'react'
import './adminWidgets.scss'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import useFetch from '../../config/service/useFetch';
import { getAllCount } from '../../config/endpoints/get';

const AdminWidgets = () => {

    const {data} = useFetch(getAllCount)

  return (
    <div className="AdminWidgets">
        <div className='widget'>
            <div className="leftContainer">
                <SchoolIcon className='icon' style={{"backgroundColor": "var(--light-green)", "color": "var(--green)"}}/>
            </div>
            <div className="rightContainer">
                <h2>{data.student}</h2>
                <h4>Students</h4>
            </div>
        </div>
        <div className='widget'>
            <div className="leftContainer">
                <EmojiPeopleIcon className='icon' style={{"backgroundColor": "var(--light-blue)", "color": "var(--blue)"}}/>
            </div>
            <div className="rightContainer">
                <h2>{data.teacher}</h2>
                <h4>Teachers</h4>
            </div>
        </div>
        <div className='widget'>
            <div className="leftContainer" >
                <LibraryBooksIcon className='icon' style={{"backgroundColor": "var(--light-purple)", "color": "var(--purple)"}}/>
            </div>
            <div className="rightContainer">
                <h2>{data.subject}</h2>
                <h4>Subjects</h4>
            </div>
        </div>
        <div className='widget'>
            <div className="leftContainer">
                <PeopleIcon className='icon' style={{"backgroundColor": "var(--light-pink)", "color": "var(--pink)"}}/>
            </div>
            <div className="rightContainer">
                <h2>{data.class}</h2>
                <h4>Classes</h4>
            </div>
        </div>
    </div>
  )
}

export default AdminWidgets