import $ from "jquery";
import bbox from "@turf/bbox";
import { GeoJSON, WMSTileLayer, LayersControl } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import WMSCapabilities from "wms-capabilities/dist/wms-capabilities";
import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import Label from "./Label";

export default function LoadLayer(props) {
  const [data, setData] = useState(null);
  const [isRaster, setIsRaster] = useState(false);
  const [raster, setRaster] = useState(null);
  const { Overlay } = LayersControl;
  const geoJsonLayer = useRef();

  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  let defaultStyle = {
    fillColor: getRandomColor(),
    fillOpacity: 0.5,
    weight: 1,
    color: getRandomColor(),
    labelColor: getRandomColor(),
    labelSize: 12,
    opacity: 1,
    radius: 5,
    column: "none",
  };

  let rasterStyle = {
    fillColor: "#000000",
    fillOpacity: 0.5,
    weight: 1,
    labelColor: "#000000",
    labelSize: 12,
    color: "#000000",
    opacity: 1,
    radius: 5,
    column: "none",
  };

  useEffect(async () => {
    setData(null);
    if (geoJsonLayer.current && props.body.data.layer[props.index]) {
      await geoJsonLayer.current?.leafletElement?.clearLayers();
      setData(props.body.data.layer[props.index]);
    }
  }, [
    props.body.styles[props.index]?.column,
    props.body.styles[props.index]?.labelColor,
    props.body.styles[props.index]?.labelSize,
  ]);

  useEffect(() => {
    if (isRaster) {
      setRaster(null);
      fetch(encodeURI(getRasterUrl(props.url)), {
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
            .indexOf(props.url.split(":")[1]);

          if (pos !== -1) {
            const bbounds = layers[pos].BoundingBox[0].extent;
            const c1 = [bbounds[1], bbounds[0]];
            const c2 = [bbounds[3], bbounds[2]];
            let d = props.body;
            d.data.bounds = [c1, c2];
            props.updateBody(d);
            setRaster(props.url);
            let dd = props.body;
            d.styles.push(rasterStyle);
            props.updateBody(dd);
          }
        })
        .catch((err) => {});
    }
  }, [isRaster]);

  function getRasterUrl(url) {
    return `/geoserver/${
      url.split(":")[0]
    }/wms?service=wms&version=1.1.1&request=GetCapabilities&layers=${url}`;
  }

  useEffect(() => {
    if (props.url) {
      setData(null);
      var response = $.ajax({
        url: encodeURI(getUrl(props.url, null)),
        dataType: "json",
        success: {},
        error: function (xhr) {
          setData(null);
          setIsRaster(true);
        },
      });
      $.when(response).done(function (data) {

        if (data.features.length !== 0) {
          const bbx = bbox(response.responseJSON);
          const c1 = [bbx[1], bbx[0]];
          const c2 = [bbx[3], bbx[2]];
          let d = props.body;
          d.data.bounds = [c1, c2];
          d.data.layer.push(response.responseJSON);
          props.updateBody(d);
          setData(data);
          let dd = props.body;
          d.styles.push(defaultStyle);
          props.updateBody(dd);
        }
      });
    }
  }, [props.url]);

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

  const pointToLayer = (feature, latlng) => {
    return L.circleMarker(latlng, null);
  };

  const style = (feature) => {
    let style = null;
    if (props.body.styles[props.index]) {
      let d = props.body.styles[props.index];
      style = {
        fillColor: d.fillColor,
        fillOpacity: d.fillOpacity,
        weight: d.weight,
        color: d.color,
        opacity: d.opacity,
        radius: d.radius,
      };
    } else {
      style = defaultStyle;
    }
    return style;
  };

  const onEachFeature = async (feature, layer) => {
    const txt = feature.properties[props.body.styles[props.index]?.column];

    await layer.bindTooltip(
      ReactDOMServer.renderToString(
        <Label
          color={props.body.styles[props.index]?.labelColor}
          size={props.body.styles[props.index]?.labelSize}
          txt={txt?.toString()}
        />
      ),
      {
        permanent: true,
        direction: "center",
        className: "label",
        offset: [0, -2],
      }
    );
  };

  return (
    <>
      {data && (
        <Overlay checked={true} name={props.url.split(":")[1]}>
          <GeoJSON
            data={data}
            pointToLayer={pointToLayer}
            onEachFeature={onEachFeature}
            style={style}
            ref={geoJsonLayer}
          ></GeoJSON>
        </Overlay>
      )}
      {raster && (
        <Overlay checked={true} name={raster.split(":")[1]}>
          <WMSTileLayer
            format="image/png"
            layers={`layers=${raster}`}
            transparent="true"
            url={`/geoserver/${raster.split(":")[0]}/wms?`}
          />
        </Overlay>
      )}
    </>
  );
}
