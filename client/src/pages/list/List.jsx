import "./list.scss"
import Datatable from "../../components/datatable/Datatable"

// column is specifications of the columns in the datatable that needs to be displayed, they are specified in source
// name is the name of the datatable
// type tells admin side or student side

const List = ({ column, name }) => {
  return (
    <div className="list">
      <div className="AdminListContainer">

        {/* Call datatable by passing the required props */}
        <Datatable column={column} name={name} />
      </div>
    </div>
  )
}

export default List