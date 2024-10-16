import React from 'react';

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  const label = () => {
    const date = new Date(toolbar.date);
    const options = { month: 'long', year: 'numeric', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={goToCurrent}>Today</button>
        <button type="button" onClick={goToBack}>Back</button>
        <button type="button" onClick={goToNext}>Next</button>
      </span>
      <span className="rbc-toolbar-label">{label()}</span>
      <span className="rbc-btn-group">
        <button type="button" onClick={() => toolbar.onView('month')}>Month</button>
        {/* <button type="button" onClick={() => toolbar.onView('week')}>Week</button> */}
        {/* <button type="button" onClick={() => toolbar.onView('day')}>Day</button> */}
        <button type="button" onClick={() => toolbar.onView('agenda')}>Agenda</button>
      </span>
    </div>
  );
};

export default CustomToolbar;
