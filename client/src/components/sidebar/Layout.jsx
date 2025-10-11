import React from 'react';
import MainSidebar from './MainSidebar'; // Assuming this is your sidebar component
import Navbar from '../../components/navbar/Navbar';

const Layout = ({ children }) => {

  return (
    <div style={{ display: 'flex' }}>
      <MainSidebar />
      <Navbar />
      <div style={{ flex: 1, marginLeft: '80px', marginTop: '80px' }}>
        {/* This will render the page content */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
