import "./datatable.scss";

// datagrid from library
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


// useFetch and axios for fetching data
import axios from "axios";
import useFetch from "../../hooks/useFetch.js"

// Modal for showing the details about tasks and updates
import Modal from "../../components/modal/Modal";
import { getDatatableURL } from "../../source/endpoints/get.js";
import { getDeleteURL } from "../../source/endpoints/delete.js";




// column, name and type are props input at the place datatable is used
const Datatable = ({ column, name, type }) => {

  // we use location url to extract the path 
  const location = useLocation();

  let path

  // if we are at admin side then the end point will be at 2 because we have 
  // additional /admin in the url

  if (type === "Admin")
    path = location.pathname.split("/")[2];
  else 
    path = location.pathname.split("/")[1];


  // fetching data using the path
  const { user } = useContext(AuthContext)
  const { data } = useFetch(getDatatableURL(path, user))


  // array usestate that gets fed every time page loads
  const [list, setList] = useState([]);

  // this usestate is to toggle modal open or close
  const [openModal, setOpenModal] = useState(false);

  // this usestate is to set the rowid i.e. the id of the data entry user clicked to view
  const [rowid, setRowid] = useState("");

  // feeding the data when page rerenders or data changes
  useEffect(() => {
      if(path === "queries")
        setList(data.filter(item => item.queryTo === user._id))
      else
        setList(data)
  }, [data])


  // function that handles delete operation based on id passed to it
  const handleDelete = async (id) => {
    
    // this deletes data from the database
    try {
      await axios.delete(getDeleteURL(path, id), { withCredentials: false }
      );

      // this filters the array by filtering out the deleted element based on the id
      setList(list.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err)
    }
  };


  // this sets the rowid and modal use states when user clicks on view button of a particular entry
  const handleClick = (id) => {
    setOpenModal(true);
    setRowid(id);
  }

  // function that handles the format of the table
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => {
        return (

          <div className="cellAction">


            {/* view will take you to Single page in case of users and open modals in case of tasks and updates */}
            {
            (path === "students" || path === "faculties") ? 
              (
                <>
                {/* params.row._id will give us the id of the data entry at particular row we clicked */}
                <Link to={`/admin/${path}/${params.row._id}`} style={{ textDecoration: "none" }}>
                  <div className="viewButton">View</div>
                </Link>
                </>
              ) : 
              
              (
                // handleclick will update openModal and rowid so that a popup can open with details of the data entry user wants to see
                <div className="viewButton" onClick={() => handleClick(params.row._id)}>
                  {name==="Query"? "Respond" : "View"}
                </div>
              )
            }

            {(type === "Admin" || type==="Creator") && <Link to={`${params.row._id}/edit`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Edit</div>
            </Link>}
            
            {/* Only admin can delete so it will only be visible to him */}
            {
              (type === "Admin" || type==="Creator") && <div
                className="deleteButton"
                onClick={() => handleDelete(params.row._id)}
              >
                Delete
              </div>
            }

            {/* Only admin can add a course to a teacher so it will only be visible to him */}
            {
              (type === "Admin" && path === "faculties") && <Link to={`/admin/${path}/${params.row._id}/addCourse`} style={{ textDecoration: "none" }}>
                <div className="viewButton"
              >
                Add Course
              </div>
              </Link>
            }

          </div >
        );
      },
    },
  ];

  return (
    <div className="datatable">
      
      {/* Title will be shown based on which table is */}
      <div className="datatableHeader">
        <div className="datatableTitle">
        {name}
        </div>
        {(type === "Admin" || type==="Creator" )&& <Link to={`new`} style={{"textDecoration": "none"}}>
          <div className="link">
            Create
          </div>
        </Link>}
      </div>

      {/* Datagrid element */}
      {<DataGrid
        className="datagrid"
        rows={list} // list is the array of data we fetched from the server
        columns={column.concat(actionColumn)} // column is contains specifications of columns and gets formatted by action column function
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowId={row => row._id}
      />}

      {/* Modal gets shown based on how user clicks and props get passed to it */}
      {/* id is the id of the data that needs to be displayed and path will tell which list of data we are viewing */}
      {openModal && <Modal setOpen={setOpenModal} id={rowid} type={path} />}
    </div>
  );
};

export default Datatable;
