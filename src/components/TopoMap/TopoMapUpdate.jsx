import {
  MapContainer,
  ZoomControl,
  LayersControl,
  MapConsumer,
} from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import SidePanel from "../maps/SidePanel";
import FileSaver from "file-saver";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import AttributeData from "../maps/AttributeData";
import thematicData from "../../assets/data/thematicData";
import AlertMsg from "../maps/AlertMsg";
import BottomPanel from "../maps/BottomPanel";
import BaseMaps from "../maps/BaseMaps";
import "leaflet";
import "leaflet-simple-map-screenshoter";
import LoadLayer from "./LoadLayer";
// openlayers
import GeoJSON from "ol/format/GeoJSON";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import XYZ from "ol/source/XYZ";
import myData from "../../assets/data/data";
import $ from "jquery";
import { fromLonLat } from "ol/proj";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function TopoMapUpdate(props) {
  let template = {
    data: {
      url: [],
      layer: [],
      bounds: null,
      basemap: 0,
      filters: null,
    },
    styles: [],
    style: {
      column: null,
      columnData: [],
      classification: null,
      classes: null,
    },
    attributes: {
      Title: "",
      Theme: props.theme,
      Description: "",
      Dataset: "",
      Keywords: "",
      Owner: "",
      Type: "",
      Thumbnail: "",
    },
  };
  const [body, setBody] = useState(template);
  const [msg, setMsg] = useState(null);
  const [myMap, setMyMap] = useState(null);
  let simpleMapScreenshoter = null;
  const pathname = window.location.pathname.split("/")[4];
  //set initial state
  const [map, setMap] = useState(null);
  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;

  const baseLayer = new TileLayer({
    source: new XYZ({
      url: myData[4].url,
    }),
  });
  const [layers, setLayers] = useState([baseLayer]);

  useEffect(() => {
    const initialMap = new Map({
      target: mapElement.current,
      layers: layers,
      view: new View({
        projection: "EPSG:3857",
        center: fromLonLat([37, -1]),
        zoom: 12,
      }),
      controls: [],
    });

    setMap(initialMap);
  }, []);

  useEffect(() => {
    if (map) {
      fetch(`/api/gis/${pathname}`, {
        method: "get",
        credentials: "include",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          let d = body;
          let cl = JSON.parse(data?.Style);
          d.styles = cl;
          d.data.url = JSON.parse(data?.URL);
          d.style.classification = data?.Classification;
          d.style.column = data?.Column;
          d.attributes.Title = data?.Title;
          d.attributes.Theme = data?.Category;
          d.attributes.Description = data?.Description;
          d.attributes.Thumbnail = data?.Thumbnail;
          d.attributes.Dataset = data?.Dataset;
          d.attributes.Keywords = data?.Keywords;
          d.attributes.Owner = data?.Owner;
          d.attributes.Type = data?.Type;
          updateBody(d);
          d.data.url.forEach((item, index) => {
            loadLayers(item, d.styles[index]);
          });
        })
        .catch((err) => {});
    }
  }, [map]);

  function getUrl(url, filters) {
    if (!filters) {
      return `/geoserver/${
        url.split(":")[0]
      }/wfs?request=GetFeature&version=1.0.0&typeName=${url}&maxFeatures=10000&outputFormat=json`;
    } else {
      return `/geoserver/${
        url.split(":")[0]
      }/wfs?request=GetFeature&version=1.0.0&typeName=${url}&${filters}&maxFeatures=10000&outputFormat=json`;
    }
  }

  function loadLayers(url, stl) {
    var response = $.ajax({
      url: encodeURI(getUrl(url, null)),
      dataType: "json",
      success: {},
      error: function (xhr) {},
    });
    $.when(response).done(function (data) {
      if (data.features.length > 0) {
        const feature = new VectorLayer({
          source: new VectorSource({
            features: new GeoJSON({
              dataProjection: "EPSG:4326",
              featureProjection: "EPSG:3857",
            }).readFeatures(data),
          }),
          style: new Style({
            stroke: new Stroke({
              color: stl?.color,
              width: stl?.weight,
              opacity: stl?.opacity,
            }),
            fill: new Fill({
              color: stl?.fillColor,
              opacity: stl?.fillOpacity,
            }),
            image: new CircleStyle({
              radius: stl?.radius,
              fill: new Fill({
                color: stl?.fillColor,
                opacity: stl?.fillOpacity,
              }),
              stroke: new Stroke({
                color: stl?.color,
                width: stl?.weight,
                opacity: stl?.opacity,
              }),
            }),
          }),
        });

        map.addLayer(feature);

        map.getView().fit(feature.getSource().getExtent(), {
          padding: [100, 100, 100, 100],
        });
      }
    });
  }

  const updateBody = (bd) => {
    if (body.data.basemap !== bd.data.basemap) {
      let d = bd;
      d.data.basemap = null;
      setBody({ ...body, d });
    }
    setBody({ ...body, bd });
  };

  const submitData = () => {
    let bdy = thematicData;
    bdy.Title = body.attributes.Title;
    bdy.Category = body.attributes.Theme;
    bdy.Description = body.attributes.Description;
    bdy.Thumbnail = body.attributes.Thumbnail;
    bdy.Dataset = body.attributes.Dataset;
    bdy.Keywords = body.attributes.Keywords;
    bdy.Owner = body.attributes.Owner;
    bdy.Type = body.attributes.Type;
    bdy.URL = JSON.stringify(body.data.url);
    bdy.Column = body.style.column;
    bdy.Classification = body.style.classification;
    bdy.Style = body.styles;

    if (checkInputs(bdy)) {
      fetch(`/api/gis/${pathname}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bdy),
      })
        .then((res) => {
          if (res.ok) return res.json();
          else throw Error("");
        })
        .then((data) => {
          setMsg("Submitted successfully!");
        })
        .catch((e) => {
          setMsg("Creation failed!");
        });
    }
  };

  const checkInputs = (bdy) => {
    let vl = true;

    if (!bdy.Title || bdy.Title === "") {
      setMsg("Map title is required!");
      return (vl = false);
    }
    if (!bdy.Category || bdy.Category === "") {
      setMsg("Please load some spatial data!");
      return (vl = false);
    }
    if (!bdy.Description || bdy.Description === "") {
      setMsg("Map description is required!");
      return (vl = false);
    }
    if (!bdy.Thumbnail || bdy.Thumbnail === "") {
      setMsg("Please upload a thumbnail!");
      return (vl = false);
    }
    if (!bdy.Dataset || bdy.Dataset === "") {
      setMsg("Please load some spatial data!");
      return (vl = false);
    }
    if (!bdy.Keywords || bdy.Keywords === "") {
      setMsg("At least 1 keyword is required!");
      return (vl = false);
    }
    if (!bdy.Owner || bdy.Owner === "") {
      setMsg("Data owner is required!");
      return (vl = false);
    }
    if (!bdy.Type || bdy.Type === "") {
      setMsg("Data Type is required!");
      return (vl = false);
    }
    if (!bdy.URL === "") {
      setMsg("Please load some spatial data!");
      return (vl = false); 
    }

    return vl;
  };

  const printMap = () => {
    let format = "blob";
    let overridedPluginOptions = {
      mimeType: "image/jpeg",
    };
    simpleMapScreenshoter
      ?.takeScreen(format, overridedPluginOptions)
      .then((blob) => {
        FileSaver.saveAs(blob, "map.png");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div>
      <div className="map">
        <div
          ref={mapElement}
          style={{ width: "100%", height: "80vh" }}
          className="map-container"
        ></div>

        <SidePanel update={true} body={body} updateBody={updateBody} />
        {body.attributes.Theme !== "Topo Map" && (
          <BottomPanel
            printMap={printMap}
            body={body}
            updateBody={updateBody}
          />
        )}
      </div>
      <div className="attribute">
        <AttributeData
          body={body}
          submitData={submitData}
          updateBody={updateBody}
        />
      </div>
      {msg && <AlertMsg msg={msg} setMsg={setMsg} />}
    </div>
  );
}
