import {
  MapContainer,
  ZoomControl,
  MapConsumer,
  WMSTileLayer,
  LayersControl,
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
import WMSCapabilities from "wms-capabilities/dist/wms-capabilities";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function BaseMapPreview(props) {
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
  const [bounds,setBounds] = useState(null);
  const [simpleMapScreenshoter, setSimpleScreenShooter] = useState();
  const [title, setTitle] = useState();
  const pathname = window.location.pathname.split("/")[5];
  const { Overlay } = LayersControl;

  
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

  useEffect(() => {
    if (body.data.url) {
      setData(null);
      fetch(encodeURI(getUrl(body.data.url)), {
        method: "get",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) {
            throw Error("Could not fetch messages!!!");
          }
          return res.text();
        })
        .then(async (data) => {
          const layers = await new WMSCapabilities(data).toJSON().Capability
            .Layer.Layer;

          const pos = layers
            .map(function (e) {
              return e.Name;
            })
            .indexOf(body.data.url.split(":")[1]);

          if (pos !== -1) {
            const bbounds = layers[pos].BoundingBox[0].extent;
            const c1 = [bbounds[1], bbounds[0]];
            const c2 = [bbounds[3], bbounds[2]];
            setBounds([c1, c2]);
            let d = body;
            d.data.bounds = [c1, c2];
            updateBody(d);
            setData(body.data.url);
          }
        })
        .catch((err) => {console.log(err);});
    }
  }, [body.data.url]);

  function getUrl(url) {
    return `/geoserver/${
      url.split(":")[0]
    }/wms?service=wms&version=1.1.1&request=GetCapabilities&layers=${url}`;
  }

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
          <MapConsumer>
            {(map) => {
              if (body.data.bounds) {
                map.fitBounds(body.data.bounds);
              }
              if (!myMap) setMyMap(map);

              return null;
            }}
          </MapConsumer>

          <LayersControl>
            <BaseMaps />
            {data && (
              <>
                <Overlay checked={true} name={body.data.url.split(":")[1]}>
                  <WMSTileLayer
                    format="image/png"
                    layers={`layers=${data}`}
                    transparent="true"
                    url={`/geoserver/${data.split(":")[0]}/wms?`}
                  />
                </Overlay>
              </>
            )}
          </LayersControl>

          <ZoomControl position="bottomright" />
        </MapContainer>

        <SidePanel update={true} body={body} updateBody={updateBody} />
        <BottomPanel
          printMap={printMap}
          body={body}
          updateBody={updateBody}
          simpleMapScreenshoter={simpleMapScreenshoter}
        />
      </div>
      <div className="attribute">
        <PreviewData body={body} />
      </div>
      {msg && <AlertMsg msg={msg} setMsg={setMsg} />}
    </div>
  );
}
