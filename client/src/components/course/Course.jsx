import React from 'react'
import { useState } from 'react'
import './course.scss'
import Popup from '../popUps/Popup'

const Course = ({index, name, subjectCode, syllabusPicture, teacher}) => {
  const colors = ['var(--light-blue)', 'var(--light-pink)', 'var(--light-yellow)', 'var(--light-purple)', 'var(--light-red)']

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  return (
    <div className='courseComponent'>
        <div className="course" key={index} style={{ backgroundColor: colors[index % colors.length]}}>
            <h3>{name}</h3>
            <p>{subjectCode}</p>
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