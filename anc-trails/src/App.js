import React from 'react';
import Map from './Map/Map';
import Controls from './Controls/Control';
 
function App() {
  return (
    <div className="map-container">
      <Controls />
      <Map />
    </div>
  );
}

export default App;
