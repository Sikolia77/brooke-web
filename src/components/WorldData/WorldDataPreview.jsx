import {
  MapContainer,
  ZoomControl,
  GeoJSON,
  MapConsumer,
  LayersControl,
  FeatureGroup,
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

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function WorldDataPreview(props) {
  let template = {
    data: {
      url: null,
      layer: null,
      basemap: 0,
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
  const [body, setBody] = useState(template);
  const [msg, setMsg] = useState(null);
  const [data, setData] = useState(null);
  const [myMap, setMyMap] = useState(null);
  const [simpleMapScreenshoter, setSimpleScreenShooter] = useState();
  const pathname = window.location.pathname.split("/")[5];
  const { Overlay } = LayersControl;  
  const [extent, setExtent] = useState(null);
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    if (extent) {
      let d = body;
      d.data.filters = `CQL_FILTER=INTERSECTS(the_geom, POLYGON((${extent})))`;
      updateBody(d);
    }
  }, [bounds]);

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
        return res.json();
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
      })
      .catch((err) => {});;
  }, []);

  useEffect(() => {
    if (myMap) {
      let pluginOptions = {
        cropImageByInnerWH: true,
        hidden: false,
        preventDownload: false,
        domtoimageOptions: {},
        position: "topright",
        screenName: "screen",
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
    }
  }, [myMap]);

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
        if (data.features.length !== 0) {
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
    return {
      fillColor: "#FF7A00",
      color: "#030092",
      fillOpacity: 0.5,
      weight: 0.5,
      radius: 5,
    };
  };

  const pointToLayer = (feature, latlng) => {
    return L.circleMarker(latlng, null);
  };

  const updateBody = (bd) => {
    if (body.data.basemap !== bd.data.basemap) {
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
        <MapContainer
          style={{ width: "100%", height: "80vh" }}
          center={[-1.2921, 36.8219]}
          zoom={12}
          maxZoom={18}
          zoomControl={false}
        >
          <LayersControl>
            <BaseMaps />
            {data && (
              <Overlay checked={true} name={body.data.url.split(":")[1]}>
                <GeoJSON
                  data={data}
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
        </MapContainer>

        <SidePanel
          worldData={true}
          update={true}
          body={body}
          updateBody={updateBody}
        />
        <BottomPanel
          printMap={printMap}
          body={body}
          updateBody={updateBody}
          simpleMapScreenshoter={simpleMapScreenshoter}
        />
      </div>

      <PreviewData body={body} />

      {msg && <AlertMsg msg={msg} setMsg={setMsg} />}
    </div>
  );
}
