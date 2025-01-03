import "./table.scss";

import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";

const GenericTable = ({
  columns,
  rows,
  rowKey, // Unique identifier for rows
  onRowClick,
  actions, // Optional action buttons or components
  customStyles,
  isScrollable = false,
}) => {
  return (
    <TableContainer
      component={Paper}
      className={`genericTable ${isScrollable ? "scrollable" : ""}`}
      style={customStyles?.container}
    >
      <Table sx={{ minWidth: 650 }} aria-label="generic table">
        <TableHead style={customStyles?.head}>
          <TableRow>
            {columns?.map((col, index) => (
              <TableCell
                key={index}
                style={{ fontWeight: "bold", ...col.headerStyle }}
                className="tableCell"
              >
                {col.label}
              </TableCell>
            ))}
            {actions && <TableCell className="tableCell">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <TableRow
              key={row[rowKey]}
              onClick={() => onRowClick && onRowClick(row)}
              className="tableRow"
              style={customStyles?.row}
            >
              {columns.map((col, index) => (
                <TableCell key={index} className="tableCell">
                  {col.render ? col.render(row[col.field], row) : row[col.field]}
                </TableCell>
              ))}
              {actions && (
                <TableCell className="tableCell">
                  {actions.map((ActionComponent, index) => (
                    <ActionComponent key={index} row={row} />
                  ))}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

GenericTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func, // Custom rendering for the column
      headerStyle: PropTypes.object, // Style for header cells
    })
  ).isRequired,
  rows: PropTypes.array.isRequired,
  rowKey: PropTypes.string.isRequired,
  onRowClick: PropTypes.func,
  actions: PropTypes.arrayOf(PropTypes.func),
  customStyles: PropTypes.object,
  isScrollable: PropTypes.bool,
};

export default GenericTable;
