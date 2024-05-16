import React from 'react';

const BookSearchForm = ({ onSearch }) => {
  const handleSearch = () => {
    const searchData = document.getElementById('search-box').value;
    onSearch(searchData);
  };

  return (
    <div id="title" className="center">
      <h1 id="header" className="text-center mt-5">Book Finder</h1>
      <div className="row">
        <div id="input" className="input-group mx-auto col-lg-6 col-md-8 col-sm-12">
          <input id="search-box" type="text" className="form-control" placeholder="Search Books!..." />
          <button id="search" className="btn btn-primary" onClick={handleSearch}>Search</button>
        </div>
      </div>
    </div>
  );
};

export default BookSearchForm;