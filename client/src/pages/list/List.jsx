import "./list.scss"

import AdminNavbar from "../../components/adminNavbar/AdminNavbar"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"

// column is specifications of the columns in the datatable that needs to be displayed, they are specified in source
// name is the name of the datatable
// type tells admin side or student side

const List = ({ column, name, type }) => {
  return (
    <div className="list">
      <div className="AdminListContainer">
        {(type === "Admin") ? (<AdminNavbar />) : (<Navbar />)}

        {/* Call datatable by passing the required props */}
        <Datatable column={column} name={name} type={type} />
      </div>
    </div>
  )
}

export default List