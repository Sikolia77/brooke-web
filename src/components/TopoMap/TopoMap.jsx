
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
import "leaflet";
import "leaflet-simple-map-screenshoter";
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

export default function TopoMap(props) {
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
  const [toggleMap, setToggleMap] = useState(true);
  let simpleMapScreenshoter = null;
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
      body.data.url.forEach((item, index) => {
        loadLayers(item, body.styles[index]);
      });
    }
  }, [map, toggleMap, body.data.url.length]);

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

  function loadLayers(url, style) {
    var response = $.ajax({
      url: encodeURI(getUrl(url, null)),
      dataType: "json",
      success: {},
      error: function (xhr) {},
    });
    $.when(response).done(function (data) {
      let stl = {
        fillColor: getRandomColor(),
        color: getRandomColor(),
        weight: 1,
        radius: 5,
      };

      if (style) stl = style;
      else {
        let d = body;
        d.styles.push(stl);
        updateBody(d);
      }

      if (data.features.length > 0) {
        let d = body;
        d.data.layer.push(data);
        updateBody(d);

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

  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const updateBody = (bd) => {
    if (bd.data.url.length !== body.data.url.length) {
      setToggleMap(!toggleMap);
    }
    if (body.data.basemap !== bd.data.basemap) {
      let d = bd;
      d.data.basemap = null;
      setBody({ ...body, d });
    }

    

    setBody({ ...body, bd });
  };

  const updateMapStyle = (bd, index) => {
    if (map) {
      
      map.getLayers().forEach((layer,i) => {
        if(i===index){
          let stl = bd.styles[index]
          let style =  new Style({
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
          })
         layer.setStyle(style)
        }
      });
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
    bdy.URL = JSON.stringify(body.data.url);
    bdy.Column = body.style.column;
    bdy.Classification = body.style.classification;
    bdy.Style = body.styles;

    if (checkInputs(bdy)) {
      fetch("/api/gis/create", {
        method: "POST",
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
        <SidePanel
          body={body}
          new={true}
          updateBody={updateBody}
          updateMapStyle={updateMapStyle}
        />
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
