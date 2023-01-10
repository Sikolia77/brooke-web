import {
  MapContainer,
  ZoomControl,
  LayersControl,
  MapConsumer,
} from "react-leaflet";
import { useEffect, useState } from "react";
import SidePanel from "../maps/SidePanel";
import FileSaver from "file-saver";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import AlertMsg from "../maps/AlertMsg";
import BottomPanel from "../maps/BottomPanel";
import BaseMaps from "../maps/BaseMaps";
import "leaflet";
import "leaflet-simple-map-screenshoter";
import PreviewData from "../maps/PreviewData";
import LoadLayer from "./LoadLayer";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function TopoMapPreview(props) {
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

  const [simpleMapScreenshoter, setSimpleScreenShooter] = useState(null);
  const pathname = window.location.pathname.split("/")[5];
  const [title, setTitle] = useState();

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
    }
  }, [myMap]);

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
          style={{ width: "100%", height: "100%" }}
          center={[-1.2921, 36.8219]}
          zoom={12}
          maxZoom={18}
          zoomControl={false}
        >
          <LayersControl>
            <BaseMaps />
            {body.data.url.length > 0 &&
              body.data.url.map((item, index) => {
                return (
                  <LoadLayer
                    key={index}
                    index={index}
                    body={body}
                    updateBody={updateBody}
                    url={item}
                  />
                );
              })}
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
        </MapContainer>

        <SidePanel
          update={true}
          body={body}
          updateBody={updateBody}
          instanceId={props.instanceId}
          instance={props.body}
        />
        <BottomPanel
          printMap={printMap}
          body={body}
          updateBody={updateBody}
          simpleMapScreenshoter = {simpleMapScreenshoter}
        />
      </div>
      <div className="attribute">
        <PreviewData body={body} />
      </div>
      {msg && <AlertMsg msg={msg} setMsg={setMsg} />}
    </div>
  );
}
