// App.js
import './books.css'


import React, { useState } from 'react';
import BookSearchForm from './BookSearchForm';
import BookList from './BookList';
import BookViewer from './BookViewer';

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBookIsbn, setSelectedBookIsbn] = useState(null);

  const handleSearch = (searchData) => {
    // Perform search and update searchResults state
    // For simplicity, assuming searchData is used to fetch search results
    // using an API or some data source.
    // You should implement this logic based on your requirements.
    // Example:
    // fetchData(searchData).then((data) => setSearchResults(data.items || []));
  };

  const handleBookSelect = (isbn) => {
    // Set the selected book ISBN for BookViewer component
    setSelectedBookIsbn(isbn);
  };

  return (
    <div className="app">
      <BookSearchForm onSearch={handleSearch} />
      <BookList books={searchResults} onBookSelect={handleBookSelect} />
      {selectedBookIsbn && <BookViewer isbn={selectedBookIsbn} />}
    </div>
  );
};

export default App;
