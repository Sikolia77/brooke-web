import { useEffect, useRef, useState } from "react";
import myData from "../../assets/data/data";
import {
  MapConsumer,
  MapContainer,
  TileLayer,
  GeoJSON,
  ZoomControl,
} from "react-leaflet";
import Button from "../Utils/Button";

import leafletImage from "leaflet-image";
import { PDFDownloadLink, PDFRenderer, PDFViewer } from "@react-pdf/renderer";
import SearchReport from "./SearchReport";
import bbox from "@turf/bbox";

const Item = (props) => {
  return (
    <div className="item">
      <h5>{props.data.label}</h5>
      <p>{props.data.txt}</p>
    </div>
  );
};

export default function Details(props) {
  const [basemap, setBasemap] = useState(myData[0]);
  const baseLayer = useRef(null);
  const [data, setData] = useState(null);
  const [geom, setGeom] = useState(null);
  const [myMap, setMyMap] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [parcel, setParcel] = useState(null);

  useEffect(() => {
    if (myMap) {
      leafletImage(myMap, function (err, canvas) {
        // setImage(canvas.toDataURL());
      });
    }
  }, [myMap]);

  useEffect(() => {
    fetch(`/api/valuation/combined/${props.detail}`)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((data) => {
        if (data.rows.length > 0) {
          setPdfData(data.rows[0])
          let cols = Object.keys(data.rows[0]);
          let d = [];
          cols.forEach((item) => {
            if (
              item != "ValID" &&
              item != "SubCounty" &&
              item != "Ward" &&
              item != "Situation" &&
              item != "geom"
            ) {
              d.push({ label: item, txt: data.rows[0][item] });
            }
          });
          if (data.rows[0].geom != null) setGeom(true);
          setData(d);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    if (geom) {
      fetch(`/api/valuation/geom/${props.detail}`)
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data.length != 0) {
            let d = JSON.parse(data[0].st_asgeojson);
            const bbx = bbox(d);
            const c1 = [bbx[1], bbx[0]];
            const c2 = [bbx[3], bbx[2]];
            setBounds([c1, c2]);
            setParcel(d);
          }
        })
        .catch((e) => {
          setGeom(null);
        });
    } else setGeom(null);
  }, [geom]);

  return (
    <div className="model">
      <i
        onClick={() => {
          props.updateDetail(null);
        }}
        className="fa fa-close"
      >
        &#xf00d;
      </i>
      <MapContainer
        style={{ width: "100%", height: "250px" }}
        center={[-1.7886, 37.6333]}
        zoom={10}
        minZoom={5}
        maxZoom={18}
        zoomControl={false}
      >
        <TileLayer
          ref={baseLayer}
          attribution={basemap.attribution}
          url={basemap.url}
        />

        {parcel && (
          <GeoJSON
            data={parcel}
            bounds={bounds}
            style={{ fillColor: "yellow" }}
          />
        )}

        <MapConsumer>
          {(map) => {
            if (bounds) {
              map.fitBounds(bounds);
            }
            if (!myMap) {
              setMyMap(map);
            }
            return null;
          }}
        </MapConsumer>
        <ZoomControl position="topright" />
      </MapContainer>
      <br></br>
      <div className="details">
        {data &&
          data.map((item) => {
            return <Item data={item} />;
          })}
      </div>
      {data && (
        <PDFDownloadLink
          document={<SearchReport data={pdfData} />}
          fileName="SearchReport"
        >
          {({ blob, url, loading, error }) =>
            loading ? (
              "Generating PDF..."
            ) : (
              <Button handleClick={() => {}} label="Export to PDF" />
            )
          }
        </PDFDownloadLink>
      )}
    </div>
  );
}
