import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../config/context/AuthContext.js";
import axios from "axios";
import useFetch from "../../config/service/useFetch.js";
import Modal from "../popUps/Modal.jsx";
import { getDatatableURL } from "../../config/endpoints/get.js";
import { getDeleteURL } from "../../config/endpoints/delete.js";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import AddClass from "../../pages/class/AddClass.jsx";

const Datatable = ({ column, name, type }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const { user } = useAuth();
  const { data, loading } = useFetch(getDatatableURL(path, user));
  const [list, setList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [popupName, setPopupName] = useState("");
  const [rowid, setRowid] = useState("");

  useEffect(() => {
    if (path === "queries") {
      setList(data?.filter((item) => item.queryTo === user._id) || []);
    } else {
      setList(data || []);
    }
  }, [data, path, user._id]);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(getDeleteURL(path, id), { withCredentials: true });
      if (res.data.status === "success") {
        toast.success(`${name} deleted successfully!`);
        setList((prevList) => prevList.filter((item) => item._id !== id));
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to perform deletion. Please try again.";
      toast.error(errorMessage);
      console.error(err);
    }
  };

  const handleClick = (id, type) => {
    setOpenModal(true);
    setRowid(id);
    setPopupName(type);
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => (
        <div className="cellAction">
          {path === "students" || path === "faculties" ? (
            <Link to={`/admin/${path}/single/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
          ) : (
            <div className="viewButton" onClick={() => handleClick(params.row._id, "query")}>
              {name === "Query" ? "Respond" : "View"}
            </div>
          )}

          {(type === "Admin" || type === "Creator") && (
            <Link to={`edit/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="editButton">Edit</div>
            </Link>
          )}

          {(type === "Admin" || type === "Creator") && (
            <div className="deleteButton" onClick={() => handleDelete(params.row._id)}>
              Delete
            </div>
          )}

          {type === "Admin" && path === "faculties" && (
            <div className="viewButton" onClick={() => handleClick(params.row._id, "course")}>
              Add Course
            </div>
          )}

          {type === "Creator" && path === "tests" && (
            <Link to={`/faculty/tests/marks/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="editButton">Marks</div>
            </Link>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="datatable-container">
      {loading ? (
        <div className="page-loader">
          <ClipLoader color="black" size={50} />
          <h3>Loading data...</h3>
        </div>
      ) : (
        <div className="datatable">
          <div className="datatableHeader">
            <div className="datatableTitle">{name}</div>
            {(type === "Admin" || type === "Creator") && (
              <Link to={`new`} style={{ textDecoration: "none" }}>
                <div className="link">Create</div>
              </Link>
            )}
          </div>

          <DataGrid
            className="datagrid"
            rows={list}
            columns={column.concat(actionColumn)}
            pageSize={10}
            rowsPerPageOptions={[10]}
            getRowId={(row) => row._id}
          />

          {openModal && (
            <>
              {popupName === "course" && <AddClass setOpen={setOpenModal} facId={rowid} type={path} />}
              {popupName === "query" && <Modal setOpen={setOpenModal} id={rowid} type={path} />}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Datatable;
