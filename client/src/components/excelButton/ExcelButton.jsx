import * as XLSX from 'xlsx';
import "./excelButton.scss"
import DownloadIcon from '@mui/icons-material/Download';

const ExportButton = ({data, formatted, filename, title}) => {

  const exportToExcel = (data, filename = `${filename}.xlsx`) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className='export-button'>
        <DownloadIcon onClick={() => exportToExcel(formatted, `${filename}.xlsx`)}/>
    </div>
  );
};

export default ExportButton;
