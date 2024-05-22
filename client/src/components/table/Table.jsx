import "./table.scss";

// elements of the table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// to fetch data
import useFetch from "../../hooks/useFetch.js"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import { getTableURL } from "../../source/endpoints/get.js";

const List = () => {

  // fetch latest/upcoming events
  const {user} = useContext(AuthContext)
  const { data } = useFetch(getTableURL(user));
  // const newData= data.slice(0, 5);

  return (
    <TableContainer component={Paper} className="table" style={{overflowY: "scroll", height: "400px"}}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead style={{"backgroundColor": "#EEEEEE"}}>

          {/* Column Names */}
          <TableRow>
            <TableCell className="tableCell" style={{"fontWeight": "bold"}}>Update</TableCell>
            <TableCell className="tableCell" style={{"fontWeight": "bold"}}>Description</TableCell>
          </TableRow>
        </TableHead>


        <TableBody>
          {data?.map((row) => (

            // row.id is just a number
            <TableRow key={row.id}>
              
              {/* Event poster and name
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  <img src={row.poster} alt="" className="image" />
                  {row.name}
                </div>
              </TableCell> */}

              {/* Other details */}
              <TableCell className="tableCell">{row.title}</TableCell>
              <TableCell className="tableCell">{row.desc}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;