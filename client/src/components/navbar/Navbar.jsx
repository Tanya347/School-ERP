import './navbar.scss'

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';

import { useAuth } from '../../config/context/AuthContext';
import { getSingleData, getUpdateURL } from '../../config/endpoints/get';
import useFetch from '../../config/service/useFetch'
import { DarkModeContext } from "../../config/context/darkModeContext";

import NotificationsDropdown from './NotificationsDropdown';

const Navbar = () => {
    const { Dispatch } = useContext(DarkModeContext);
    const [schoolInfo, setSchoolInfo] = useState({});
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();
    const { data = [] } = useFetch(getUpdateURL(user));


    // Get current date and date 7 days ago
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    // Filter notifications from the past week
    const notifications = (data || []).filter(n => {
        // Ensure n.date is a valid date string or Date object
        const notifDate = new Date(n.updatedAt);
        return notifDate >= weekAgo && notifDate <= now;
    });

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout("Logged Out Successfully!");
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


    useEffect(() => {
        async function fetchData() {
            const schoolData = await axios.get(process.env.REACT_APP_API_URL + getSingleData(user.schoolID, "schools"));
            setSchoolInfo(schoolData.data.data);
        }
        fetchData();
    }, [user.schoolID]);

    // Helper function to convert string to Title Case
    function toTitleCase(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

return (
    <div className='navbar-container'>
        <div className="navbar-content">
            <div className="left-navbar-container">
                <div className="logo">
                    <img src={schoolInfo.logo} alt="" />
                </div>
                <div className="school-name">
                    <h2>{toTitleCase(schoolInfo.name)}</h2>
                </div>
            </div>
            <div className="right-navbar-container">
                <div className="profile">
                    {user.role === "admin" ? ( <img src="https://i.ibb.co/MBtjqXQ/no-avatar.gif" alt="" /> ) : ( <img src={user.profilePicture} alt="" />)}
                </div>
                <h3 className="username">{user.username}</h3>
                <div className="notifications-wrapper" ref={dropdownRef}>
                    <NotificationsIcon className="icon" onClick={()=> setShowNotifications(!showNotifications)}/>
                    {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                    {showNotifications && <NotificationsDropdown notifs={notifications} user={user}/>}
                </div>
                <div className="dark-mode-toggle" onClick={() => Dispatch({ type: "TOGGLE" })}>
                    <DarkModeIcon className="icon" />
                </div>
                <div className="" onClick={handleLogout}>
                    <ExitToAppIcon className="icon" />
                </div>
            </div>
        </div>
    </div>
)
}

export default Navbar