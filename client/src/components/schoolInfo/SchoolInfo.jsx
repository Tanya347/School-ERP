import './schoolInfo.scss'
import useFetch from '../../config/service/useFetch'
import { getSingleData } from '../../config/endpoints/get'
import Loader from '../loader/Loader'
import { toast } from "react-toastify";

const SchoolInfo = ({schoolID}) => {

    const { data, loading, error } = useFetch(getSingleData(schoolID, "schools"))

    if (error) {
      toast.error(
        <div>
          <strong>School Information Fetch Failed</strong>
          <div>{error.response?.data?.message || error.message || 'Unknown error'}</div>
        </div>
      );
    }

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