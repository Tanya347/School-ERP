import React from 'react'
import CancelIcon from '@mui/icons-material/Cancel';
import './popup.scss'

const Popup = ({
    title, 
    content,
    actions,
    onClose,
    customClass
}) => {
    return (
        <div className={`popupModal ${customClass || ''}`}>
            <div className="popupContainer">
                <CancelIcon
                    className="popupClose"
                    onClick={onClose}
                />
                {title && <div className="popupTitle">{title}</div>}
                {content ? (<div className="popupContent">
                    {typeof content === 'string' ? <p>{content}</p> : content}
                </div>) : (
                    <div className="popupContent">
                        <div className="popupDesc"></div>
                    </div>
                )}
                {actions && (
                <div className="popupActions">
                    {actions.map((action, index) => (
                    <button
                        key={index}
                        className="popupButton"
                        onClick={action.onClick}
                    >
                        {action.label}
                    </button>
                    ))}
                </div>
                )}
            </div>
        </div>
    )
}

export default Popup;