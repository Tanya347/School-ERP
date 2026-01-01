import "./tableWithoutAction.scss";

// datagrid from library
import { DataGrid } from "@mui/x-data-grid";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// useFetch and axios for fetching data
import useFetch from "../../config/service/useFetch.js"

// Modal for showing the details about tasks and updates
import { getClassCourses, getTableWithoutActionURL } from "../../config/endpoints/get.js";

// column, name and type are props input at the place datatable is used
const TableWithoutAction = ({ column, name }) => {

  // we use location url to extract the path 
  const location = useLocation();

  let path = location.pathname.split("/")[3];
  let id = location.pathname.split("/")[4];


  // fetching data using the path
  const { data } = useFetch(getTableWithoutActionURL(path, id))
  const courses = useFetch(getClassCourses(id)).data;

  // array usestate that gets fed every time page loads
  const [list, setList] = useState([]);
  const [course, setCourses] = useState([]);

  // feeding the data when page rerenders or data changes
  useEffect(() => {
    setList(data)
  }, [data])

  useEffect(() => {
    setCourses(courses)
  }, [courses])

  return (
    <div className="table-without-action">

      <div className="table-without-action-container">

        {/* Title will be shown based on which table is */}
        <div className="datatableHeader">
          <div className="datatableTitle">
          {name}
          </div>
        </div>

        {/* Datagrid element */}
        {<DataGrid
          className="datagrid"
          rows={list} // list is the array of data we fetched from the server
          columns={column(course)} // column is contains specifications of columns and gets formatted by action column function
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={row => row._id}
        />}
      </div>
      
    </div>
  );
};

export default TableWithoutAction;
