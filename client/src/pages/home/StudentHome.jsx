import "./studentHome.scss"
import { useAuth } from '../../config/context/AuthContext'
// import useFetch from '../../config/service/useFetch'
// import { getUpdateURL } from '../../config/endpoints/get'
import SchoolInfo from "../../components/schoolInfo/SchoolInfo"
// import GenericTable from "../../components/table/Table"
import EventCalender from "../../components/calender/Calender"
import Lecture from "../../components/lecture/Lecture"
// import { updateColumns } from "../../config/tableSource/updateColumns"

const StudentHome = () => {
  const {user} = useAuth();
 
  return (
    <div className='student-home-container'>
      <div className="main-container">
        <div className="left-container">
          <SchoolInfo schoolID={user.schoolID} />
          {/* <div className="notifications-container">
            <h2 className="listTitle">Latest Notifications</h2>
              <GenericTable columns={updateColumns} rows = {data} rowKey="id" isScrollable={true}/>
          </div> */}
        </div>
         <div className="right-container">
          <EventCalender />
          <Lecture id={user?.class} type={user?.role} />
        </div>
      </div>
    </div>
  )
}

export default StudentHome