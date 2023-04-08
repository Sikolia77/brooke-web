import {
  MapContainer,
  ZoomControl,
  GeoJSON,
  MapConsumer,
  LayersControl,
} from "react-leaflet";
import { useEffect, useState } from "react";
import SidePanel from "../maps/SidePanel";
import FileSaver from "file-saver";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import AlertMsg from "../maps/AlertMsg";
import $ from "jquery";
import bbox from "@turf/bbox";
import BaseMaps from "../maps/BaseMaps";
import "leaflet";
import "leaflet-simple-map-screenshoter";
import PreviewData from "../maps/PreviewData";
import StyleMap from "../maps/StylingTools";
import AnalysisTools from "../maps/AnalysisTools";
import InfoTools from "../maps/InfoTools";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function AdvocacyPreview(props) {
  let template = {
    data: {
      url: null,
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
  const cls = ["Unique Classification", "Range Classification"];
  const [body, setBody] = useState(template);
  const [msg, setMsg] = useState(null);
  const [data, setData] = useState(null);
  const [myMap, setMyMap] = useState(null);
  const pathname = window.location.pathname.split("/")[5];
  const Overlay = LayersControl;
  const [extent, setExtent] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [pChartImgUrl, setPChartImgUrl] = useState();
  const [bChartImgUrl, setBChartImgUrl] = useState();
  const [title, setTitle] = useState();

  useEffect(() => {
    if (extent) {
      let d = body;
      d.data.filters = `CQL_FILTER=INTERSECTS(the_geom, POLYGON((${extent})))`;
      updateBody(d);
    }
  }, [bounds]);


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
        setTitle(data?.Title);
      })
      .catch((err) => {});
  }, []);

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


  return (
    <div className="preview">
      <div className="attribute">
        <PreviewData body={body} />
      </div>
      <div className="map">
        <MapContainer
          style={{ width: "100%", height: "90vh" }}
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
          <ZoomControl position="topright" />
        </MapContainer>

        
        <StyleMap
          update={false}
          body={body}
          updateBody={updateBody}
          instanceId={props.instanceId}
          instance={props.body}
          pChartImgUrl={pChartImgUrl}
          setPChartImgUrl={setPChartImgUrl}
          bChartImgUrl={bChartImgUrl}
          setBChartImgUrl={setBChartImgUrl}
        />

        <AnalysisTools
          update={false}
          body={body}
          updateBody={updateBody}
          instanceId={props.instanceId}
          instance={props.body}
          pChartImgUrl={pChartImgUrl}
          setPChartImgUrl={setPChartImgUrl}
          bChartImgUrl={bChartImgUrl}
          setBChartImgUrl={setBChartImgUrl}
        />

        <InfoTools
          update={false}
          body={body}
          updateBody={updateBody}
          instanceId={props.instanceId}
          instance={props.body}
          pChartImgUrl={pChartImgUrl}
          setPChartImgUrl={setPChartImgUrl}
          bChartImgUrl={bChartImgUrl}
          setBChartImgUrl={setBChartImgUrl}
        />

      </div>
      {msg && <AlertMsg msg={msg} setMsg={setMsg} />}
    </div>
  );
}
