import './navbar.scss'

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Tooltip } from '@mui/material';

import { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { clearNotifications } from "../../utils/store/slices/notificationSlice";
import { clearAdmin } from '../../utils/store/slices/adminSlice';
import { clearFaculty } from '../../utils/store/slices/facultySlice';
import { clearSchool } from '../../utils/store/slices/schoolSlice';
import { logoutUser } from "../../utils/store/slices/authSlice"
import { DarkModeContext } from "../../utils/context/darkModeContext";
import { profile_url } from '../../utils/shared/constants';
import { checkAdmin, toTitleCase } from '../../utils/shared/commons';

import NotificationsDropdown from './notifications/NotificationsDropdown';

const Navbar = () => {

    const [showNotifications, setShowNotifications] = useState(false);

    const dropdownRef = useRef(null);
    
    const { Dispatch } = useContext(DarkModeContext);
    const { user } = useSelector(state => state.auth);

    const dispatch = useDispatch();
    const { info } = useSelector(state => state.school);

    const { list = [] } = useSelector(
        state => state.notifications
    );

    // Get current date and date 7 days ago
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    // Filter notifications from the past week
     const notifications = list.filter(n => {
        const notifDate = new Date(n.updatedAt);
        return notifDate >= weekAgo && notifDate <= now;
    });

    const handleLogout = async (e) => {
        dispatch(logoutUser());
        dispatch(clearNotifications());
        dispatch(clearSchool());
        dispatch(clearAdmin());
        dispatch(clearFaculty());
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
            ) {
            setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);


    return (
        <div className='navbar-container'>
            <div className="navbar-content">
                <div className="left-navbar-container">
                    <div className="logo">
                        <img src={info?.logo} alt="" />
                    </div>
                    <div className="school-name">
                        <h2>{toTitleCase(info?.name)}</h2>
                    </div>
                </div>
                <div className="right-navbar-container">
                    <div className="profile">
                        {checkAdmin(user.role) ? ( <img src={profile_url} alt="" /> ) : ( <img src={user.profilePicture} alt="" />)}
                    </div>
                    <h3 className="username">{user.username}</h3>
                    <div className="notifications-wrapper" ref={dropdownRef}>
                        <NotificationsIcon className="icon" onClick={()=> setShowNotifications(!showNotifications)}/>
                        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                        {showNotifications && <NotificationsDropdown notifs={notifications} user={user}/>}
                    </div>
                    <Tooltip title="Toggle Dark Mode" arrow>
                        <div className="dark-mode-toggle" onClick={() => Dispatch({ type: "TOGGLE" })}>
                            <DarkModeIcon className="icon" />
                        </div>
                    </Tooltip>
                    <Tooltip title="Logout" arrow>
                        <div className="" onClick={handleLogout}>
                            <ExitToAppIcon className="icon" />
                        </div>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export default Navbar