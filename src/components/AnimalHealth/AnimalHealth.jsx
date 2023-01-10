import {
  MapContainer,
  Polygon,
  Marker,
  ZoomControl,
  GeoJSON,
  LayersControl,
  MapConsumer,
} from "react-leaflet";
import { useEffect, useState } from "react";
import SidePanel from "../maps/SidePanel";
import FileSaver from "file-saver";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import AttributeData from "../maps/AttributeData";
import thematicData from "../../assets/data/thematicData";
import AlertMsg from "../maps/AlertMsg";
import BottomPanel from "../maps/BottomPanel";
import $ from "jquery";
import bbox from "@turf/bbox";
import BaseMaps from "../maps/BaseMaps";
import "leaflet";
import "leaflet-simple-map-screenshoter";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const DrawPolygon = (props) => {
  return (
    <>
      {props.polygon.length !== 0 && (
        <>
          {props.polygon.length > 2 && (
            <Polygon color="purple" positions={props.polygon} />
          )}
          {
            (props.polygon.length =
              0 &&
              props.polygon.map((item, index) => {
                return <Marker key={index} position={item}></Marker>;
              }))
          }
        </>
      )}
    </>
  );
};

export default function AnimalHealth(props) {
  let template = {
    data: {
      url: null,
      layer: null,
      bounds: null,
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
  const polygon = useState([]);
  const [pChartImgUrl, setPChartImgUrl] = useState();
  const [bChartImgUrl, setBChartImgUrl] = useState();
  const [simpleMapScreenshoter, setSimpleScreenShooter] = useState();
  //let simpleMapScreenshoter = null;
  const { Overlay } = LayersControl;

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
    let style = null;
    if (body.style.classification === cls[0]) {
      if (body.style.classes?.length > 0) {
        const pos = body.style.classes
          .map(function (e) {
            return e.name;
          })
          .indexOf(feature.properties[body.style.column]);
        if (pos !== -1) {
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
    bdy.Type = body.attributes.Type;
    bdy.URL = body.data.url;
    bdy.Column = body.style.column;
    bdy.Classification = body.style.classification;
    bdy.Style = body.style.classes;

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
          if (data.message == "User Created successfully") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/admin/newinstance";
          }
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
    if (!bdy.URL || bdy.URL === "") {
      setMsg("Please load some spatial data!");
      return (vl = false);
    }
    if (!bdy.Column || bdy.Column === "") {
      setMsg("Data classification is required!");
      return (vl = false);
    }
    if (!bdy.Classification || bdy.Classification === "") {
      setMsg("Data classification is required!");
      return (vl = false);
    }
    if (!bdy.Style || bdy.Style?.length === 0) {
      setMsg("Data classification is required!");
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
                  onEachFeature={onEachFeature}
                  pointToLayer={pointToLayer}
                  style={style}
                />
              </Overlay>
            )}
          </LayersControl>

          <MapConsumer>
            {(map) => {
              if (body.data.bounds) {
                map.fitBounds(body.data.bounds);
              }
              if (!myMap) setMyMap(map);

              return null;
            }}
          </MapConsumer>
          <ZoomControl position="bottomright" />
          <DrawPolygon polygon={polygon} />
        </MapContainer>
        <SidePanel
          body={body}
          updateBody={updateBody}
          new={true}
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
