import {
  MapContainer,
  ZoomControl,
  GeoJSON,
  MapConsumer,
  LayersControl,
  FeatureGroup,
  Circle,
  Polygon,
  Marker,
} from "react-leaflet";
import { useEffect, useState } from "react";
import SidePanel from "../maps/SidePanel";
import FileSaver from "file-saver";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import AlertMsg from "../maps/AlertMsg";
import BottomPanel from "../maps/BottomPanel";
import $ from "jquery";
import bbox from "@turf/bbox";
import BaseMaps from "../maps/BaseMaps";
import "leaflet";
import "leaflet-simple-map-screenshoter";
import PreviewData from "../maps/PreviewData";
import { EditControl } from "react-leaflet-draw";
import { ScaleControl } from "react-leaflet";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function CommunicationPreview(props) {
  let template = {
    data: {
      url: null,
      layer: null,
      basemap: 0,
      filters: null,
    },
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
  const cls = ["Unique Classification", "Range Classification"];
  const [body, setBody] = useState(template);
  const [msg, setMsg] = useState(null);
  const [data, setData] = useState(null);
  const [myMap, setMyMap] = useState(null);
  const [polygon, setPolygon] = useState([]);
  const [simpleMapScreenshoter, setSimpleScreenShooter] = useState(null);
  const pathname = window.location.pathname.split("/")[5];
  const { BaseLayer, Overlay } = LayersControl;
  const [extent, setExtent] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [title, setTitle] = useState();
  const [pChartImgUrl, setPChartImgUrl] = useState();
  const [bChartImgUrl, setBChartImgUrl] = useState();

  useEffect(() => {
    if (extent) {
      let d = body;
      d.data.filters = `CQL_FILTER=INTERSECTS(geom, POLYGON((${extent})))`;
      updateBody(d);
    }
  }, [extent]);

  const polygonCreated = (layer) => {
    let b = [];
    let bSW = [];
    bSW.push(layer["_bounds"]["_southWest"]?.lat);
    bSW.push(layer["_bounds"]["_southWest"]?.lng);
    let bNE = [];
    bNE.push(layer["_bounds"]["_northEast"]?.lat);
    bNE.push(layer["_bounds"]["_northEast"]?.lng);
    b.push(bSW);
    b.push(bNE);
    let d = "";

    layer["_latlngs"][0]?.map((item) => {
      d += `${item.lng} ${item.lat},`;
    });
    d += `${layer["_latlngs"][0][0].lng} ${layer["_latlngs"][0][0].lat}`;

    setExtent(d);
    setBounds(b);
  };

  const polygonDeleted = () => {
    let d = body;
    d.data.filters = null;
    updateBody(d);
  };

  useEffect(() => {
    fetch(`/api/gis/${pathname}`, {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        else throw "Error";
      })
      .then((data) => {
        let d = body;
        let cl = JSON.parse(data?.Style);
        d.style.classes = cl;
        d.data.url = data?.URL;
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
        setTitle(data?.Title);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (myMap) {
      let pluginOptions = {
        cropImageByInnerWH: true,
        hidden: false,
        preventDownload: false,
        domtoimageOptions: {},
        position: "topright",
        screenName: title,
        hideElementsWithSelectors: [".leaflet-control-container"],
        mimeType: "image/png",
        caption: null,
        captionFontSize: 15,
        captionFont: "Arial",
        captionColor: "black",
        captionBgColor: "white",
        captionOffset: 5,

        onPixelDataFail: async function ({
          node,
          plugin,
          error,
          mapPane,
          domtoimageOptions,
        }) {
          return plugin._getPixelDataOfNormalMap(domtoimageOptions);
        },
      };

      setSimpleScreenShooter(
        L.simpleMapScreenshoter(pluginOptions).addTo(myMap)
      );

      setPChartImgUrl("/");
    }
  }, [bounds]);

  useEffect(() => {
    if (body.data.url) {
      setData(null);

      var response = $.ajax({
        url: encodeURI(getUrl(body.data.url, body.data.filters)),
        dataType: "json",
        success: {},
        error: function (xhr) {
          setData(null);
        },
      });
      $.when(response).done(function (data) {
        if (data.features.length != 0) {
          const bbx = bbox(response.responseJSON);
          const c1 = [bbx[1], bbx[0]];
          const c2 = [bbx[3], bbx[2]];
          let d = body;
          d.data.bounds = [c1, c2];
          d.data.layer = response.responseJSON;
          updateBody(d);
          setData(data);
        }
      });
    }
  }, [body.data.filters, body.data.url]);

  function getUrl(url, filters) {
    if (!filters) {
      return `/geoserver/${
        url.split(":")[0]
      }/wfs?request=GetFeature&version=1.0.0&typeName=${url}&outputFormat=json`;
    } else {
      return `/geoserver/${
        url.split(":")[0]
      }/wfs?request=GetFeature&version=1.0.0&typeName=${url}&${filters}&outputFormat=json`;
    }
  }

  const style = (feature) => {
    let style = null;
    if (body.style.classification === cls[0]) {
      if (body.style.classes?.length > 0) {
        const pos = body.style.classes
          .map(function (e) {
            return e.name;
          })
          .indexOf(feature.properties[body.style.column]);
        if (pos != -1) {
          style = {
            fillColor: body.style.classes[pos].color,
            fillOpacity: 0.8,
            color: body.style.classes[pos].color,
            weight: 1,
            radius: 5,
          };
        }
      }
    } else if (body.style.classification === cls[1]) {
      body.style.classes?.forEach((item, index) => {
        const lw = item.min;
        const up = item.max;
        const val = parseInt(feature.properties[body.style.column]);
        if (val >= lw && val < up) {
          style = {
            fillColor: item.color,
            fillOpacity: 0.8,
            color: item.color,
            weight: 1,
            radius: 5,
          };
        }
      });
    }
    return style ? style : { fillColor: "#60606020", weight: 1 };
  };

  const pointToLayer = (feature, latlng) => {
    return L.circleMarker(latlng, null);
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: function () {
        let txt = feature.properties[body.style.column]
          ? feature.properties[body.style.column]
          : "Your data is not classified";
        layer.bindPopup(txt);
      },
    });
  };

  const updateBody = (bd) => {
    if (body.data.basemap != bd.data.basemap) {
      let d = bd;
      d.data.basemap = null;
      setBody({ ...body, d });
    }
    setBody({ ...body, bd });
  };

  const printMap = () => {
    let format = "blob";
    let overridedPluginOptions = {
      mimeType: "image/jpeg",
    };
    simpleMapScreenshoter
      .takeScreen(format, overridedPluginOptions)
      .then((blob) => {
        FileSaver.saveAs(blob, "map.png");
      })
      .catch((e) => {});
  };

  return (
    <div>
      <div className="map">
        <MapContainer
          style={{ width: "100%", height: "100%" }}
          center={[-1.2921, 36.8219]}
          zoom={12}
          maxZoom={30}
          zoomControl={false}
        >
          <LayersControl>
            <BaseMaps />
            {data && (
              <Overlay checked={true} name={body.data.url.split(":")[1]}>
                <GeoJSON
                  data={data}
                  onEachFeature={onEachFeature}
                  pointToLayer={pointToLayer}
                  style={style}
                />
              </Overlay>
            )}
          </LayersControl>

          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={(e) => {
                polygonCreated(e.layer);
              }}
              onEdited={(e) => {
                let key = Object.keys(e.layers["_layers"]);
                polygonCreated(e.layers["_layers"][key]);
              }}
              onDeleted={(e) => {
                polygonDeleted();
              }}
              draw={{
                circle: false,
                circlemarker: false,
                polyline: false,
                marker: false,
              }}
            />
          </FeatureGroup>

          <MapConsumer>
            {(map) => {
              if (bounds) {
                setBounds(bounds);
                bounds && map.fitBounds(bounds);
              }
              if (body.data.bounds) {
                setBounds(body.data.bounds);
                bounds && map.fitBounds(bounds);
              }
              if (!myMap) setMyMap(map);

              return null;
            }}
          </MapConsumer>
          <ZoomControl position="bottomright" />
          <ScaleControl position="bottomleft" />
        </MapContainer>

        <SidePanel
          update={true}
          body={body}
          updateBody={updateBody}
          instanceId={props.instanceId}
          instance={props.body}
          pChartImgUrl={pChartImgUrl}
          setPChartImgUrl={setPChartImgUrl}
          bChartImgUrl={bChartImgUrl}
          setBChartImgUrl={setBChartImgUrl}
        />
        <BottomPanel
          printMap={printMap}
          body={body}
          updateBody={updateBody}
          simpleMapScreenshoter={simpleMapScreenshoter}
          pChartImgUrl={pChartImgUrl}
          setPChartImgUrl={setPChartImgUrl}
          bChartImgUrl={bChartImgUrl}
          setBChartImgUrl={setBChartImgUrl}
        />
      </div>
      <div className="attribute">
        <PreviewData body={body} />
      </div>
      {msg && <AlertMsg msg={msg} setMsg={setMsg} />}
    </div>
  );
}
