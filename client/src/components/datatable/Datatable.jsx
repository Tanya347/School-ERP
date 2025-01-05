import "./datatable.scss";

// datagrid from library
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../config/context/AuthContext.js";

// useFetch and axios for fetching data
import axios from "axios";
import useFetch from "../../config/service/useFetch.js"

// Modal for showing the details about tasks and updates
import Modal from "../popUps/Modal.jsx";
import { getDatatableURL } from "../../config/endpoints/get.js";
import { getDeleteURL } from "../../config/endpoints/delete.js";
import { toast } from "react-toastify"
import { ClipLoader } from "react-spinners";
import AddClass from "../../pages/class/AddClass.jsx";




// column, name and type are props input at the place datatable is used
const Datatable = ({ column, name, type }) => {

  // we use location url to extract the path 
  const location = useLocation();

  let path = location.pathname.split("/")[2];


  // fetching data using the path
  const { user } = useAuth();
  const { data, loading } = useFetch(getDatatableURL(path, user))


  // array usestate that gets fed every time page loads
  const [list, setList] = useState([]);

  // this usestate is to toggle modal open or close
  const [openModal, setOpenModal] = useState(false);
  const [popupName, setPopupName] = useState('');

  // this usestate is to set the rowid i.e. the id of the data entry user clicked to view
  const [rowid, setRowid] = useState("");

  // feeding the data when page rerenders or data changes
  useEffect(() => {
      if(path === "queries")
        setList(data.filter(item => item.queryTo === user._id))
      else
        setList(data)
  }, [data, path, user._id])


  // function that handles delete operation based on id passed to it
  const handleDelete = async (id) => {
    
    // this deletes data from the database
    try {
      const res = await axios.delete(getDeleteURL(path, id), { withCredentials: true });
      if(res.data.status === 'success') {
        toast.success(`${name} deleted successfully!`);
      }

      // this filters the array by filtering out the deleted element based on the id
      setList(list.filter((item) => item._id !== id));
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to perform deletion. Please try again.";
      toast.error(errorMessage);
      console.error(err);
      return err;
    }
  };


  // this sets the rowid and modal use states when user clicks on view button of a particular entry
  const handleClick = (id, type) => {
    setOpenModal(true);
    setRowid(id);
    setPopupName(type)
  }

  console.log(rowid)
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
                <Link to={`/admin/${path}/single/${params.row._id}`} style={{ textDecoration: "none" }}>
                  <div className="viewButton">View</div>
                </Link>
                </>
              ) : 
              
              (
                // handleclick will update openModal and rowid so that a popup can open with details of the data entry user wants to see
                <div className="viewButton" onClick={() => handleClick(params.row._id, 'query')}>
                  {name==="Query"? "Respond" : "View"}
                </div>
              )
            }

            {(type === "Admin" || type==="Creator") && <Link to={`edit/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="editButton">Edit</div>
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
              (type === "Admin" && path === "faculties") && 
              <div className="viewButton"
                onClick={() => handleClick(params.row._id, 'course')}
              >
                Add Course
              </div>
            }

            {/* Only faculty can add marks to a test so it will only be visible to them */}
            {
              (type === "Creator" && path === "tests") && <Link to={`/faculty/tests/marks/${params.row._id}`} style={{ textDecoration: "none" }}>
                <div className="editButton"
              >
                Marks
              </div>
              </Link>
            
            }

          </div >
        );
      },
    },
  ];

  return (
    <div className="datatable-container">

      {loading ? (
         <div className="page-loader">
          <ClipLoader color="black" size={50} />
          <h3>Loading data...</h3>
        </div>
      ) : (<div className="datatable">
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
        {openModal && (
          popupName === 'course' ?
            <AddClass setOpen={setOpenModal} facId={rowid} type={path} />
            : <Modal setOpen={setOpenModal} id={rowid} type={path} />
          ) 
        }
      </div>)}
    </div>
  );
};

export default Datatable;
