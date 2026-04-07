import "./excelButton.scss"

import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';

const ExportButton = ({formatted, filename, sheetName, data, columns}) => {

  const exportToExcel = (fileName) => {
    // If columns are provided, format data based on column structure
    let exportData = formatted;
    if (data && columns) {
      exportData = data.map(row => {
        const formattedRow = {};
        columns.forEach(col => {
          if (col.field) {
            formattedRow[col.label] = row[col.field];
          }
        });
        return formattedRow;
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <div className='export-button' title="Export to Excel" style={{cursor: 'pointer'}}>
        <DownloadIcon onClick={() => exportToExcel(filename)}/>
    </div>
  );
};

export default ExportButton;
