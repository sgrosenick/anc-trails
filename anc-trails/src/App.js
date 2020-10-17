import React from 'react';
import Map from './Map/Map';
import Header from './Header/Header'
import Controls from './Controls/Control';
 
function App() {
  return (
    <div className="map-container">
      <Header />
      <Controls />
      <Map />
    </div>
  );
}

export default App;
