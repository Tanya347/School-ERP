// ImageModal.js

import React from 'react';
import './imageModal.scss'; // Import your CSS file
import CancelIcon from '@mui/icons-material/Cancel';


const ImageModal = ({ imageUrl, setModalOpen }) => {
  return (
    <div className="ImageModal">
            <div className="mContainer">
                
                <CancelIcon
                    className="mClose"
                    onClick={() => setModalOpen(false)}
                />

                {imageUrl ? (<img src={imageUrl} alt="" />):(<div>Image does not exist currently</div>)}
            </div>
        </div>
  );
};

export default ImageModal;
