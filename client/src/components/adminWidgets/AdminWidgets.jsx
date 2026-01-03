import './adminWidgets.scss'

import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';

import { Link } from 'react-router-dom';

import useFetch from '../../config/service/useFetch';
import { getAllCount } from '../../config/endpoints/get';

import Loader from '../shared/loader/Loader';

const AdminWidgets = () => {

    const {data, loading } = useFetch(getAllCount)

return (
    <div className="admin-widgets">
            <div className='widget'>
                {loading ? (<Loader type="global"/>) : (<Link to={"/admin/students"} style={{textDecoration: 'none', color: 'inherit', display: 'flex', flex: 1}}>
                    <div className="left-container">
                        <SchoolIcon className='icon' style={{"backgroundColor": "var(--light-green)", "color": "var(--green)"}}/>
                    </div>
                    <div className="right-container">
                        <h2>{data.student}</h2>
                        <h4>Students</h4>
                    </div>
                </Link>)}
            </div>
            <div className='widget'>
                {loading ? (<Loader type="global" />) : (<Link to={"/admin/faculties"} style={{textDecoration: 'none', color: 'inherit', display: 'flex', flex: 1}}>
                    <div className="left-container">
                        <EmojiPeopleIcon className='icon' style={{"backgroundColor": "var(--light-blue)", "color": "var(--blue)"}}/>
                    </div>
                    <div className="right-container">
                        <h2>{data.teacher}</h2>
                        <h4>Teachers</h4>
                    </div>
                </Link>)}
            </div>
            <div className='widget'>
                {loading ? (<Loader type="global" />) : (<Link to={"/admin/courses"} style={{textDecoration: 'none', color: 'inherit', display: 'flex', flex: 1}}>
                    <div className="left-container" >
                            <LibraryBooksIcon className='icon' style={{"backgroundColor": "var(--light-purple)", "color": "var(--purple)"}}/>
                    </div>
                    <div className="right-container">
                            <h2>{data.subject}</h2>
                            <h4>Subjects</h4>
                    </div>
                </Link>)}
            </div>
            <div className='widget'>
                {loading ? (<Loader type="global" />) : (<Link to={"/admin/classes"} style={{textDecoration: 'none', color: 'inherit', display: 'flex', flex: 1}}>
                    <div className="left-container">
                            <PeopleIcon className='icon' style={{"backgroundColor": "var(--light-pink)", "color": "var(--pink)"}}/>
                    </div>
                    <div className="right-container">
                            <h2>{data.class}</h2>
                            <h4>Classes</h4>
                    </div>
                </Link>)}
            </div>
    </div>
)
}

export default AdminWidgets