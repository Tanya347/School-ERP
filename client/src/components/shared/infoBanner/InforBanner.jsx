import './infoBanner.scss'

import { iconTypes } from "../../../utils/shared/constants"

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