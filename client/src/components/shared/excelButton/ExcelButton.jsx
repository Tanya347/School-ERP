import * as XLSX from 'xlsx';
import "./excelButton.scss"
import DownloadIcon from '@mui/icons-material/Download';

const ExportButton = ({formatted, filename, title}) => {

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className='export-button'>
        <DownloadIcon onClick={() => exportToExcel(formatted, `${filename}.xlsx`)}/>
    </div>
  );
};

export default ExportButton;
