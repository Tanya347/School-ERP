import React from 'react';
import BookCard from './BookCard';

const BookList = ({ books }) => {
  return (
    <div className="book-list">
      <h2 className="text-center">Search Result</h2>
      <div id="list-output">
        <div className="row">
          {books.map((book, index) => (
            <BookCard key={index} {...book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookList;
