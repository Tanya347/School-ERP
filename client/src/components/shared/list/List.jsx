import "./list.scss"

import Datatable from "../../datatable/Datatable"

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