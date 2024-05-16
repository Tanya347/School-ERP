import React from 'react';

const BookCard = ({ bookImg, title, author, publisher, bookLink, bookIsbn }) => {
  const viewUrl = `book.html?isbn=${bookIsbn}`;

  return (
    <div className="col-lg-6">
      <div className="card">
        <div className="row no-gutters">
          <div className="col-md-4">
            <img src={bookImg} className="card-img" alt="Book Cover" />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{title}</h5>
              <p className="card-text">Author: {author}</p>
              <p className="card-text">Publisher: {publisher}</p>
              <a target="_blank" href={viewUrl} className="btn btn-secondary">Read Book</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
