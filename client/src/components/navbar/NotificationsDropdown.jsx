import React from 'react'
import './notifsdropdown.scss'
import { Link } from 'react-router-dom'

const NotificationsDropdown = ({notifs, user}) => {

    return (
        <div className='notifications-dropdown'>
                <div className="notifications-header">
                        <h3>Latest Notifications</h3>
                </div>
                <div className="notifications-list">
                        {notifs.length > 0 ? (
                                <>
                                {notifs.map((n, index) => (
                                        <div
                                                key={index}
                                                className={`notification-item ${n.read ? '' : 'unread'}`}
                                        >
                                                <h4>{n.title}</h4>
                                                <p>{n.description}</p>
                                        </div>
                                ))}
                                </>
                        ) : (
                                <p className='no-notifications'>No new notifications</p>
                        )}
                </div>
                <div className="notifications-button">
                        <Link to={`/${user.role}/updates`}>
                                <button>View All</button>
                        </Link>
                </div>
        </div>
    )
}

export default NotificationsDropdown