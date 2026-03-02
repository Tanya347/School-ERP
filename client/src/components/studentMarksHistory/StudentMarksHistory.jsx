import "./studentMarksHistory.scss";

import useFetch from "../../utils/service/useFetch";
import { getStudentMarksHistory } from "../../utils/endpoints/get";

const StudentMarksHistory = ({studentId}) => {

  const { data } = useFetch(getStudentMarksHistory(studentId));

  
  return (
    <div className="marks-history">
      
      {/* Student Info */}
      <div className="student-header">
        <h2>Marks History</h2>
      </div>

      {/* Session-wise History */}
      {data?.history?.length === 0 ? (
        <p className="no-data">No marks history available</p>
      ) : (
        <div className="history-table-container">
          {data?.history?.map((session) => (
            <div className="session-card" key={session.sessionId}>
              
              <div className="session-header">
                <h3>{session.sessionName}</h3>
                <span className="class-name">
                  Class: {session.className}
                </span>
              </div>

              <table className="marks-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {session.subjects.map((sub) => (
                    <tr key={sub.subjectId}>
                      <td>{sub.subjectName}</td>
                      <td>{sub.marks}</td>
                      <td>
                        <span className={`status ${sub.status}`}>
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentMarksHistory;
