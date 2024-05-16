import React, { useEffect } from 'react';

const BookViewer = ({ isbn }) => {
  useEffect(() => {
    const viewer = new window.google.books.DefaultViewer(document.getElementById('viewerCanvas'));
    viewer.load(`ISBN:${isbn}`);
  }, [isbn]);

  return (
    <div className="container">
      <div className="text-center" id="viewerCanvas" style={{ width: '800px', height: '600px' }}></div>
    </div>
  );
};

export default BookViewer;
