import './course.scss'

import { useState } from 'react'

import Popup from '../shared/popup/Popup'

const Course = ({index, name, subjectCode, syllabusPicture, teacher, className, examStatus}) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  return (
    <div className='course-component'>
        <div className="course" key={index}>
            <h3>{name}</h3>
            <p>{subjectCode}</p>
            {className && <p><span style={{"fontWeight":"bold"}}>Class: </span>{className}</p>}
            {examStatus && <p><span style={{"fontWeight":"bold"}}>Exam Status: </span>{examStatus}</p>}
            {teacher && <p><span style={{"fontWeight":"bold"}}>Taught by: </span>{teacher}</p>}
            <button onClick={() => openModal(syllabusPicture)}>View Syllabus</button>
        </div>

        {modalOpen && 
          <Popup
            title="View Syllabus"
            content={
              selectedImage ? <img className='syll' src={selectedImage} alt="Preview" /> : <p>Syllabus currently doesn't exist</p>
            }
            onClose={() => setModalOpen(false)}
          />
        }
    </div>
  )
}

export default Course