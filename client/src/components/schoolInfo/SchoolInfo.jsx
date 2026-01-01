import './schoolInfo.scss'
import useFetch from '../../config/service/useFetch'
import { getSingleData } from '../../config/endpoints/get'
import Loader from '../shared/loader/Loader'

const SchoolInfo = ({schoolID}) => {

  const { data, loading } = useFetch(getSingleData(schoolID, "schools"))

  return (
    <div className="school-info-container">
        {loading ? (<Loader text="loading school data..." />) : (
          <>
            <img src={data.logo} alt="" />
            <div className="text">
            <h1>{data.name}</h1>
            <p>{data.moto}</p>
        </div></>
        )}
    </div>
  )
}

export default SchoolInfo