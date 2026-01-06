import './schoolInfo.scss'

import { useSelector } from "react-redux";

import Loader from '../shared/loader/Loader'

const SchoolInfo = () => {

  const { info, loading } = useSelector(state => state.school);

  if (loading || !info) {
    return <Loader text="loading school data..." />;
  }

  return (
    <div className="school-info-container">
      <img src={info.logo} alt="school logo" />
      <div className="text">
        <h1>{info.name}</h1>
        <p>{info.moto}</p>
      </div>
    </div>
  );
}

export default SchoolInfo