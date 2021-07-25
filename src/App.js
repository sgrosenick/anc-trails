import React from 'react';
import Map from './Map/Map';
import CustomAccordion from './Controls/Accordion';
 
function App() {
  return (
    <div className="map-container">
      <CustomAccordion />
      <div id="static-popup" className="popup-empty"></div>
      <Map />
    </div>
  );
}

export default App;