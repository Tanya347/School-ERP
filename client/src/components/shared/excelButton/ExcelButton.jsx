import "./excelButton.scss"

import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';

const ExportButton = ({formatted, filename, sheetName}) => {

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className='export-button'>
        <DownloadIcon onClick={() => exportToExcel(formatted, `${filename}.xlsx`)}/>
    </div>
  );
};

export default ExportButton;
