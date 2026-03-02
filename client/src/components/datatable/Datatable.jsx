import "./datatable.scss";

import { DataGrid } from "@mui/x-data-grid";
import { Tooltip } from "@mui/material";

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux"
import { toast } from "react-toastify";

import useFetch from "../../utils/service/useFetch.js";
import { getDatatableURL } from "../../utils/endpoints/get.js";
import axiosInterceptor from "../../utils/shared/axiosInterceptor.js";
import { getDeleteURL } from "../../utils/endpoints/delete.js";
import { bulkDelete } from "../../utils/endpoints/post.js";
import { testAction } from "../../utils/endpoints/put.js";
import { facultiesConst, materialsConst, studentsConst, testsConst } from "../../utils/shared/constants.js";
import { checkAdmin, checkEditor, checkFaculty, checkSuccess } from "../../utils/shared/commons.js";
import { exportColumnMap } from "../../utils/datatablesource/exportButtonColumns.js";

import AddClass from "../addCourse/AddCourse.jsx";
import ExportButton from "../shared/excelButton/ExcelButton.jsx";
import ConfirmPopup from "../shared/confirmationPopup/ConfirmatinPopup";
import Loader from "../shared/loader/Loader.jsx";
import Popup from "../shared/popup/Popup.jsx";
import Modal from "../shared/modal/Modal.jsx";

const getExportData = (data, tableType) => {
  const columnsToExport = exportColumnMap[tableType] || Object.keys(data[0] || {});
  
  return data.map((item) => {
    const filteredItem = {};
    
    columnsToExport.forEach((col) => {
      // Handle nested field access (e.g., "classID.name", "teacher.teachername")
      const fieldParts = col.split('.');
      let value = item;
      
      for (let part of fieldParts) {
        if (value && typeof value === 'object') {
          value = value[part];
        } else {
          value = undefined;
          break;
        }
      }
      
      if (value !== undefined) {
        // Format date fields
        if ((col === "createdAt" || col === "updatedAt" || col === "dueDate" || col === "date" || col === "testDate") && value) {
          filteredItem[col] = new Date(value).toLocaleString();
        } else {
          filteredItem[col] = value;
        }
      }
    });
    
    return filteredItem;
  });
};

const Datatable = ({ column, name }) => {
  
  const [list, setList] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const location = useLocation();

  const path = location.pathname.split("/")[2];
  const { user } = useSelector(state => state.auth);
  const { data, loading } = useFetch(getDatatableURL(path, user));

  useEffect(() => {
      setList(data || []);
  }, [data]);

  const handleDelete = async (id) => {
    setConfirmMessage(`Are you sure you want to delete this ${name}?`);
    setConfirmAction(() => async () => {
      try {
        const res = await axiosInterceptor.delete(getDeleteURL(path, id));
        if (checkSuccess(res.data.status)) {
          toast.success(`${name} deleted successfully!`);
          setList((prevList) => prevList.filter((item) => item._id !== id));
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to perform deletion. Please try again.";
        toast.error(errorMessage);
      } finally {
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };

  const handleBulkDelete = async () => {
    setConfirmMessage(`Are you sure you want to delete ${selectedRows?.length} ${name}(s)?`);
    setConfirmAction(() => async () => {
      try {
        const res = await axiosInterceptor.post(
          bulkDelete(path),
          { ids: selectedRows }
        );
        if (checkSuccess(res.data.status)) {
          toast.success(`${selectedRows?.length} ${name}(s) deleted successfully!`);
          setList((prev) => prev.filter((item) => !selectedRows.includes(item._id)));
          setSelectedRows([]);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to delete items. Please try again.";
        toast.error(errorMessage);
      } finally {
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };

  const modalTypeMap = {
    tasks: "tasks",
    tests: "tests",
    updates: "updates",
    materials: "materials",
    courses: "courses",
  };

  const handleView = (row) => {
    setPopupData({
      id: row._id,
      type: modalTypeMap[path]
    });
  };


  const handleActionOnTest = async (id, action) => {
    try {
      const res = await axiosInterceptor.put(testAction(action, id), {});
      if (checkSuccess(res.data.status)) {
        window.location.reload();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to perform action. Please try again.";
      toast.error(errorMessage);
    }
  }

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 600,
      renderCell: (params) => (
        <div className="cell-action">
          {path === materialsConst ? (
            <div
              className="view-button"
              onClick={() => {
                if (params.row.fileUrl) {
                  window.open(params.row.fileUrl, "_blank", "noopener,noreferrer");
                }
              }}
            >
              View
            </div>
          ) : path === studentsConst || path === facultiesConst ? (
            <Link to={`/admin/${path}/single/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="view-button">View</div>
            </Link>
          ) : (
            <div className="view-button" onClick={() => handleView(params.row)}>
              View
            </div>
          )}

          {(checkEditor(user.role)) && (
            <Link to={`edit/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="edit-button">Edit</div>
            </Link>
          )}

          {(checkEditor(user.role)) && (
            <div className="delete-button" onClick={() => handleDelete(params.row._id)}>
              Delete
            </div>
          )}

          {checkAdmin(user.role) && path === facultiesConst && (
            <div
              className="view-button"
              onClick={() =>
                setPopupData({ id: params.row._id, type: facultiesConst })
              }
            >
              Add Course
            </div>
          )}


          {checkFaculty(user.role) && path === testsConst && (
            <>
              <Link to={`/faculty/tests/marks/${params.row._id}`} style={{ textDecoration: "none" }}>
                <div className="view-button">Add Marks</div>
              </Link>
              <div className="delete-button" onClick={() => handleActionOnTest(params.row._id, "cancel")}>
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
          <div className="datatable-header">
            <div className="datatable-title">{name}</div>
            <Tooltip title={"Export to Excel"} arrow>
              <ExportButton
                data={list}
                formatted={getExportData(list, path)}
                filename={`${name}_data`}
                sheetName={name}
              />
            </Tooltip>
            {(checkEditor(user.role)) && (
              <div style={{ display: "flex", gap: "10px" }}>
                <Link to={`new`} style={{ textDecoration: "none" }}>
                  <div className="link">Create</div>
                </Link>

                {selectedRows?.length > 0 && (
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
            columns={column?.concat(actionColumn)}
            checkboxSelection={user.role !== "student"}
            onSelectionModelChange={(ids) => setSelectedRows(ids)}
            selectionModel={selectedRows}
            pageSize={10}
            rowsPerPageOptions={[10]}
            getRowId={(row) => row._id}
            disableSelectionOnClick
          />

          {popupData && popupData.type === facultiesConst && (
            <AddClass setOpen={() => setPopupData(null)} facId={popupData.id} type={path} />
          )}

          {popupData && popupData.type !== facultiesConst && (
            <Popup
              title={`View ${name}`}
              onClose={() => setPopupData(null)}
              content={
                <Modal
                  id={popupData.id}
                  type={popupData.type}
                  setOpen={() => setPopupData(null)}
                />
              }
            />
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
