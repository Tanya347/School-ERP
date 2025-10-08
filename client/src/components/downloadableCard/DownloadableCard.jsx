import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './downloadableCard.scss';
import useFetch from '../../config/service/useFetch';

const DownloadableCard = ({
  subtitle,
  type,
  student,
  school,
  tableData,
  onDownloadName,
}) => {
  const cardRef = useRef();

  const session = useFetch(`/sessions/${student?.schoolID}`).data;

  const handleDownloadPDF = async () => {
    const card = cardRef.current;
    if (!card) return;

    try {
      const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(onDownloadName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="downloadable-card-container">
      {/* Hidden or visible card */}
      <div
        className="card"
        ref={cardRef}
      >
        <div className="card-header">
          <img src={school?.logo} alt="School Logo" />
          <h2>{school?.name}</h2>
          <h3>{subtitle}</h3>
          <h3>Session: {session.name}</h3>
        </div>

        <div className="card-student-info">
          <div className="left-container">
            <p><strong>Name:</strong> {student?.name}</p>
            <p><strong>Enrollment No:</strong> {student?.enroll}</p>
            <p><strong>Class:</strong> {tableData?.className}</p>
            <p><strong>Date of Birth:</strong> {student?.dob}</p>
            <p><strong>Gender:</strong> {student?.gender}</p>
          </div>
          <div className="right-container">
            <img src={student?.profilePicture} alt="Profile" />
          </div>
        </div>

        {/* Dynamic Table */}
        {type === 'marksheet' ? (
          <div className="card-table">
            <table>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '12px' }}>Subject Name</th>
                  <th style={{ border: '1px solid #ccc', padding: '12px' }}>Marks Obtained</th>
                  <th style={{ border: '1px solid #ccc', padding: '12px' }}>Maximum Marks</th>
                  <th style={{ border: '1px solid #ccc', padding: '12px' }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {tableData?.marksData?.map((item) => (
                  <tr key={item._id}>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{item.sub_id?.name}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{item.total}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>100</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                      {item.total >= 90
                        ? 'A+'
                        : item.total >= 80
                        ? 'A'
                        : item.total >= 70
                        ? 'B'
                        : item.total >= 60
                        ? 'C'
                        : item.total >= 50
                        ? 'D'
                        : 'F'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card-table">
            <table>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '12px' }}>Paper Code</th>
                  <th style={{ border: '1px solid #ccc', padding: '12px' }}>Subject Name</th>
                  <th style={{ border: '1px solid #ccc', padding: '12px' }}>Exam Date</th>
                  <th style={{ border: '1px solid #ccc', padding: '12px' }}>Exam Time</th>
                </tr>
              </thead>
              <tbody>
                {tableData?.examDates?.map((exam) => {
                  const examDateObj = new Date(exam.examDate);
                  const dateStr = examDateObj.toLocaleDateString();
                  const timeStr = examDateObj.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <tr key={exam._id}>
                      <td style={{ border: '1px solid #ccc', padding: '10px' }}>{exam.code}</td>
                      <td style={{ border: '1px solid #ccc', padding: '10px' }}>{exam.name}</td>
                      <td style={{ border: '1px solid #ccc', padding: '10px' }}>{dateStr}</td>
                      <td style={{ border: '1px solid #ccc', padding: '10px' }}>{timeStr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="card-signatures">
          <div className='left-signature'>
            <p>__________________________</p>
            <div>Student's Signature</div>
          </div>
          <div className='right-signature'>
            <img src="/Assets/sign.jpg" alt="Principal Signature" />
            <p>__________________________</p>
            <div>Principal's Signature</div>
          </div>
        </div>
      </div>

      {tableData?.length > 0 && (
        <button className="download-btn" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      )}
    </div>
  );
};

export default DownloadableCard;
