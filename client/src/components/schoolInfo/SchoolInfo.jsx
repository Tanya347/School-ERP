import React from 'react'
import './schoolInfo.scss'
import useFetch from '../../config/service/useFetch'
import { getSingleData } from '../../config/endpoints/get'

const SchoolInfo = ({schoolID}) => {

    const { data } = useFetch(getSingleData(schoolID, "schools"))

  return (
    <div className="school-info-container">
        <img src={data.logo} alt="" />
        <div className="text">
            <h1>{data.name}</h1>
            <p>{data.moto}</p>
        </div>
    </div>
  )
}

export default SchoolInfo