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
import AddClass from "../../pages/class/AddClass.jsx";
import ExportButton from "../shared/excelButton/ExcelButton.jsx";
import ConfirmPopup from "../shared/confirmationPopup/ConfirmatinPopup";
import Tooltip from "../../components/shared/tooltip/Tooltip.jsx";
import Loader from "../shared/loader/Loader.jsx";

const Datatable = ({ column, name }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const { user } = useAuth();
  const { data, loading } = useFetch(getDatatableURL(path, user));
  const [list, setList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [popupName, setPopupName] = useState("");
  const [rowid, setRowid] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (path === "queries") {
      setList(data?.filter((item) => item.queryTo === user._id) || []);
    } else {
      setList(data || []);
    }
  }, [data, path, user._id]);

  const handleDelete = async (id) => {
    setConfirmMessage(`Are you sure you want to delete this ${name}?`);
    setConfirmAction(() => async () => {
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
      } finally {
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };

  const handleBulkDelete = async () => {
    setConfirmMessage(`Are you sure you want to delete ${selectedRows.length} ${name}(s)?`);
    setConfirmAction(() => async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/${path}/bulk/delete`,
          { ids: selectedRows },
          { withCredentials: true }
        );
        if (res.data.status === "success") {
          toast.success(`${selectedRows.length} ${name}(s) deleted successfully!`);
          setList((prev) => prev.filter((item) => !selectedRows.includes(item._id)));
          setSelectedRows([]);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to delete items. Please try again.";
        toast.error(errorMessage);
        console.error(err);
      } finally {
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };


  const handleClick = (id, type) => {
    setOpenModal(true);
    setRowid(id);
    setPopupName(type);
  };

  const handleActionOnTest = async (id, action) => {
    try {
      const url = process.env.REACT_APP_API_URL + `/tests/${action}/${id}`;
      const res = await axios.put(url, {}, { withCredentials: true });
      if (res.data.status === "success") {
        window.location.reload();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to perform action. Please try again.";
      toast.error(errorMessage);
      console.error(err);
    }
  }

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 600,
      renderCell: (params) => (
        <div className="cellAction">
          {path === "materials" ? (
            <div
              className="viewButton"
              onClick={() => {
                if (params.row.fileUrl) {
                  window.open(params.row.fileUrl, "_blank", "noopener,noreferrer");
                }
              }}
            >
              View
            </div>
          ) : path === "students" || path === "faculties" ? (
            <Link to={`/admin/${path}/single/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
          ) : (
            <div className="viewButton" onClick={() => handleClick(params.row._id, "query")}>
              {name === "Query" ? "Respond" : "View"}
            </div>
          )}

          {(user.role === "admin" || user.role === "faculty") && (
            <Link to={`edit/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="editButton">Edit</div>
            </Link>
          )}

          {(user.role === "admin" || user.role === "faculty") && (
            <div className="deleteButton" onClick={() => handleDelete(params.row._id)}>
              Delete
            </div>
          )}

          {user.role === "admin" && path === "faculties" && (
            <div className="viewButton" onClick={() => handleClick(params.row._id, "course")}>
              Add Course
            </div>
          )}

          {user.role === "faculty" && path === "tests" && (
            <>
              <Link to={`/faculty/tests/marks/${params.row._id}`} style={{ textDecoration: "none" }}>
                <div className="viewButton">Add Marks</div>
              </Link>
              <div className="editButton" onClick={() => handleActionOnTest(params.row._id, "complete")}>
                Mark Complete
              </div>
              <div className="deleteButton" onClick={() => handleActionOnTest(params.row._id, "cancel")}>
                Mark Cancelled
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="datatable-container">
      {loading ? (
       <Loader text="Loading data..." type="global"/>
      ) : (
        <div className="datatable">
          <div className="datatableHeader">
            <div className="datatableTitle">{name}</div>
            <Tooltip content={"Export to Excel"} position="top">
              <ExportButton
                data={list}
                formatted={list.map((item) => ({
                  ...item,
                  createdAt: new Date(item.createdAt).toLocaleString(),
                  updatedAt: new Date(item.updatedAt).toLocaleString(),
                }))}
                filename={`${name}_data`}
                title={name}
              />
            </Tooltip>
            {(user.role === "admin" || user.role === "faculty") && (
              <div style={{ display: "flex", gap: "10px" }}>
                <Link to={`new`} style={{ textDecoration: "none" }}>
                  <div className="link">Create</div>
                </Link>

                {selectedRows.length > 0 && (
                  <div
                    className="link delete"
                    onClick={() => handleBulkDelete()}
                  >
                    Delete
                  </div>
                )}
              </div>
            )}
          </div>

          <DataGrid
            className="datagrid"
            rows={list}
            columns={column.concat(actionColumn)}
            checkboxSelection
            onSelectionModelChange={(ids) => setSelectedRows(ids)}
            selectionModel={selectedRows}
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
      {showConfirm && (
        <ConfirmPopup
          message={confirmMessage}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default Datatable;
