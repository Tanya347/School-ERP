import "./tableWithoutAction.scss";

import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import useFetch from "../../utils/service/useFetch.js"
import { getClassCourses, getTableWithoutActionURL } from "../../utils/endpoints/get.js";
import ExportButton from "../shared/excelButton/ExcelButton.jsx";
import InlineError from "../shared/inlineError/InlineError";

// column, name and type are props input at the place datatable is used
const TableWithoutAction = ({ column, name }) => {

  // array usestate that gets fed every time page loads
  const [list, setList] = useState([]);
  const [course, setCourses] = useState([]);

  // we use params to extract the path and id
  const { classId } = useParams();

  let path = name === "Attendance" ? "attendance" : "marks";
  let id = classId;

  // fetching data using the path
  const { data, loading, error, reFetch } = useFetch(getTableWithoutActionURL(path, id))
  const courses = useFetch(getClassCourses(id)).data;

  // feeding the data when page rerenders or data changes
  useEffect(() => {
    setList(data)
  }, [data])

  useEffect(() => {
    setCourses(courses)
  }, [courses])

  return (
    <div className="table-without-action">
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : error ? (
        <InlineError
          title={`Error loading ${name}`}
          message={error.response?.data?.message || error.message}
          onRetry={reFetch}
        />
      ) : (
        <div className="table-without-action-container">

        {/* Title will be shown based on which table is */}
        <div className="datatable-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="datatable-title">
          {name}
          </div>
          {list.length > 0 && (
            <ExportButton
              data={list}
              columns={column(course).filter(col => col.field)}
              filename={`${name.toLowerCase()}_${id || 'export'}`}
              sheetName={name}
            />
          )}
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
      )}
    </div>
  );
};

export default TableWithoutAction;
