import React from 'react';
import MainSidebar from './MainSidebar'; // Assuming this is your sidebar component

const Layout = ({ children }) => {

  return (
    <div style={{ display: 'flex' }}>
      <MainSidebar />
      <div style={{ flex: 1, marginLeft: '70px' }}>
        {/* This will render the page content */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
