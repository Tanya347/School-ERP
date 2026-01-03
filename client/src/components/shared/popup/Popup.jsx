import './popup.scss'

import CancelIcon from '@mui/icons-material/Cancel';

const Popup = ({
    title, 
    content,
    actions,
    onClose,
    customClass
}) => {
    return (
        <div className={`popup-modal ${customClass || ''}`}>
            <div className="popup-container">
                <CancelIcon
                    className="popup-close"
                    onClick={onClose}
                />
                {title && <div className="popup-title">{title}</div>}
                {content ? (<div className="popup-content">
                    {typeof content === 'string' ? <p>{content}</p> : content}
                </div>) : (
                    <div className="popup-content">
                        <div className="popup-desc"></div>
                    </div>
                )}
                {actions && (
                <div className="popup-actions">
                    {actions.map((action, index) => (
                    <button
                        key={index}
                        className="popup-button"
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