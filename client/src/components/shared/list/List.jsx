import "./list.scss"

import Datatable from "../../shared/datatable/Datatable"

const List = ({ column, name }) => {
  return (
    <div className="list">
      <div className="admin-list-container">

        {/* Call datatable by passing the required props */}
        <Datatable column={column} name={name} />
      </div>
    </div>
  )
}

export default List