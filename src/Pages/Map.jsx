import React from "react";
import Header from "../components/Utils/header";

import {
  MapContainer,
  TileLayer,
  MapConsumer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
//import L from "leaflet";
import L from "leaflet";
import "leaflet-geoserver-request/src/L.Geoserver.js";

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    
  }

  render() {
    return (
      <div>
        <Header
          isAuthenticated={this.props.isAuthenticated}
          setIsAuthenticated={this.props.setIsAuthenticated}
          currentUser={this.props.currentUser}
          setCurrentUser={this.props.setCurrentUser}
        />
        <div className="map">
          <MapContainer center={[-0.72208975, 37.1608226]} zoom={6}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapConsumer>
              {(map) => {
                
                var wfsLayer = L.Geoserver.wfs("/geoserver/wfs", {
                  layers: "MyWorkspace:kenya_county_boundary",
                  onEachFeature: function (feature, layer) {
                    layer.bindPopup(feature.properties.county);
                  },
                });
                wfsLayer.addTo(map);

                return null;
              }}
            </MapConsumer>
          </MapContainer>
        </div>
      </div>
    );
  }
}
