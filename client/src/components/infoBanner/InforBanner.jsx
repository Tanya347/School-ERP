import React from 'react'
import './infoBanner.scss'
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const iconTypes = {
    info: <InfoIcon className='icon' />,
    error: <ErrorIcon className='icon' />,
    success: <CheckCircleIcon className='icon' />
};

const InforBanner = ({type, header, description}) => {
  return (
    <div className={`infobanner-container ${type}`}>
        {iconTypes[type]}
        <div className='infobanner-content'>
            <h3>Note: {header}</h3>
            <div>{description}</div>
        </div>
    </div>
  )
}

export default InforBanner