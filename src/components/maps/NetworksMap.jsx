import $ from "jquery";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Map from "ol/Map";
import { useState, useRef, useEffect } from "react";
import { Cluster, TileWMS, XYZ } from "ol/source";
import { ZoomToExtent, defaults as defaultControls } from "ol/control";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { asArray } from "ol/color";
import Overlay from "ol/Overlay";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
import { Point } from "ol/geom";
import RippleLoading from "../Utils/RippleLoading";
import { Text } from "ol/style";
import Popup from "./Popup";
import myData from "../../assets/data/data";
import Graticule from "ol/layer/Graticule";
import "../../Styles/_map.scss";

const Item = (props) => {
  const [checked, setChecked] = useState(props.checked);

  useEffect(() => {
    props.layer.setVisible(props.checked);
  }, []);

  return (
    <div className="item">
      <input
        type="checkbox"
        onChange={(e) => {
          setChecked(e.target.checked);
          props.layer.setVisible(e.target.checked);
        }}
        name=""
        id=""
        checked={checked}
      />
      <label htmlFor="">{props.label}</label>
    </div>
  );
};

const Basemap = (props) => {
  useEffect(() => {
    if (props.selected === props.index) {
      props.layer.setSource(
        new XYZ({
          url: props.url,
          crossOrigin: "Anonymous",
        })
      );
    }
  }, [props.selected]);

  return (
    <div className="item">
      <input
        type="checkbox"
        onChange={(e) => {
          props.setSelected(props.index);
        }}
        name=""
        id=""
        checked={props.selected === props.index ? true : false}
      />
      <label htmlFor="">{props.label}</label>
    </div>
  );
};

const Network = (props) => {
  useEffect(() => {
    if (props.netSelected === props.index) {
      props.setActiveUrl(props.url);
    }
  }, [props.netSelected]);

  return (
    <div className="item">
      <input
        type="checkbox"
        onChange={(e) => {
          props.setNetSelected(props.index);
        }}
        name=""
        id=""
        checked={props.netSelected === props.index ? true : false}
      />
      <label htmlFor="">{props.label}</label>
    </div>
  );
};

const Analysis = (props) => {
  return (
    <select
      onChange={(e) => {
        props.setAnalysis(e.target.value);
      }}
    >
      {props.data.map((item, index) => {
        return (
          <option value={item} key={index}>
            {item}
          </option>
        );
      })}
    </select>
  );
};

export default function Maps(props) {
  let colors = [
    "#241F07",
    "#4D6FA3",
    "#97DF59",
    "#800000",
    "#F43FF3",
    "#64A782",
    "#0CE668",
    "#EE496A",
    "#97DF59",
    "#BF1DF3",
    "#491FC6",
    "#703695",
    "#A091CE",
    "#21FFE5",
    "#FA19B6",
    "#E2FC56",
    "#F850DC",
    "#B5FB47",
    "#D36A0A",
    "#71B60D",
    "#286EE1",
    "#13AF16",
    "#657070",
    "#358F69",
    "#994AF2",
    "#C49C62",
    "#4DEF6B",
    "#799DD6",
    "#D4625D",
    "#E6CDE1",
    "#51A09B",
    "#61645E",
  ];
  let networks = [
    { name: "Utilities", url: props.url },
    { name: "Sewer", url: "SewerNetwork" },
  ];
  const [activeUrl, setActiveUrl] = useState(props.url);
  const [map, setMap] = useState();
  const [featuresLayer, setFeaturesLayer] = useState();
  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(false);
  const [legendItems, setLegendItems] = useState([]);
  const [legendItemsStyles, setLegendItemsStyles] = useState([]);
  const tooltip = useRef();
  const [showing, setShowing] = useState([]);
  const [many, setMany] = useState({ data: null, count: 0 });
  const [single, setSingle] = useState(null);
  const [vector, setVector] = useState(null);
  const [vLayer, setVLayer] = useState(new VectorLayer({ title: "networks" }));
  const [analysis, setAnalysis] = useState("Cluster");
  const [basemap, setBasemap] = useState(new TileLayer({ title: "basemaps" }));
  const [graticule, setGraticule] = useState(
    new Graticule({
      // the style to use for the lines, optional.
      strokeStyle: new Stroke({
        color: "rgba(0,0,0,0.5)",
        width: 2,
        lineDash: [0.5, 8],
      }),
      showLabels: true,
      wrapX: false,
    })
  );
  const [layers, setLayers] = useState(new VectorLayer({ title: "layers" }));

  const [reports, setReports] = useState(new VectorLayer({ title: "reports" }));
  const [selected, setSelected] = useState(0);
  const [netSelected, setNetSelected] = useState(0);



  let legItems = [];
  let legItemsStyles = [];

  useEffect(() => {
    const Landmarks = new TileLayer({
      title: "landmarks",
      extent: [
        37.05507278442383, -0.558377325534821, 37.19850540161133,
        -0.367469221353531,
      ],
      source: new TileWMS({
        url: "/geoserver/Mathira/wms",
        params: { LAYERS: "Mathira:Landmarks", TILED: true },
        serverType: "geoserver",
        transition: 0,
      }),
    });

    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource(),
    });

    // create map
    const initialMap = new Map({
      target: mapElement.current,
      layers: [basemap, initalFeaturesLayer, vLayer, Landmarks],
      view: new View({
        projection: "EPSG:4326",
        center: [36.8721, -1.2953],
        zoom: 14,
        maxZoom: 32,
      }),
      controls: defaultControls().extend([
        new ZoomToExtent({
          extent: [
            37.05507278442383, -0.558377325534821, 37.19850540161133,
            -0.367469221353531,
          ],
        }),
      ]),
    });

    initialMap.on("moveend", function (e) {
      setShowing([]);
      setMany({ data: null, count: null });
      setSingle(null);
    });

    setMap(initialMap);
    setFeaturesLayer(initalFeaturesLayer);
  }, []);

  useEffect(() => {
    if (map) {
      // loadMapData();
      const headers = {
        Authorization: `Basic ${Buffer.from(
          "admin:geoserver",
          "utf-8"
        ).toString("base64")}`,
      };

      fetch(`/geoserver/rest/workspaces/${activeUrl}/layers`, {
        headers: headers,
      })
        .then((res) => {
          if (res.ok) return res.json();
          else throw Error("");
        })
        .then((data) => {
          if (data.layers != "" && data.layers.layer.length > 0) {
            let d = [];
            for (let i = data.layers.layer.length; i > 0; i--) {
              setIndex(i);
              loadLayer(data.layers.layer[i - 1].name, colors[i]);
              d.push({ name: data.layers.layer[i - 1].name, color: colors[i] });
            }
            setLegendItems(d);
          }
        })
        .catch((e) => {});
    }
  }, [map, activeUrl]);

  useEffect(() => {
    if (vector) {
      reports.setSource(new VectorSource());
      reports.setSource(vector);
      reports.setStyle(reportsStyle);
      map.getLayers().forEach((layer) => {
        if (layer && layer.get("title") === "Heatmap") {
          map.removeLayer(layer);
        }
      });
    }
  }, []);

  function dataStyle(feature) {
    const styleCache = {};

    let size = feature.values_.features.length;
    let style = styleCache[size];
    if (!style) {
      if (size === 1) {
        style = new Style({
          image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({
              color: "#fff",
              width: 3,
            }),
            fill: new Fill({
              color: "#5BB318",
            }),
          }),
        });
        styleCache[size] = style;
      } else {
        let r = Math.ceil(size / 5);
        if (r < 10) r = 10;
        else if (r > 40) r = 40;
        style = new Style({
          image: new CircleStyle({
            radius: r,
            stroke: new Stroke({
              color: getColor(),
              width: 3,
            }),
            fill: new Fill({
              color: "#00D7FF",
            }),
          }),
          text: new Text({
            text: size.toString(),
            fill: new Fill({
              color: "#fff",
            }),
          }),
        });
        styleCache[size] = style;
      }
    }
    return style;
  }

  function regularDataStyle(feature) {
    const style = new Style({
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: "#fff",
          width: 2,
        }),
        fill: new Fill({
          color: "#5BB318",
        }),
      }),
    });
    return style;
  }

  function reportsStyle(feature) {
    const styleCache = {};

    let size = feature?.values_?.features?.length;
    let style = styleCache[size];
    if (!style) {
      if (size === 1) {
        style = new Style({
          image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({
              color: "#fff",
              width: 3,
            }),
            fill: new Fill({
              color: "#5BB318",
            }),
          }),
        });
        styleCache[size] = style;
      } else {
        let r = Math.ceil(size / 5);
        if (r < 10) r = 10;
        else if (r > 40) r = 40;
        style = new Style({
          image: new CircleStyle({
            radius: r,
            stroke: new Stroke({
              color: getColor(),
              width: 3,
            }),
            fill: new Fill({
              color: "#00D7FF",
            }),
          }),
          text: new Text({
            text: size.toString(),
            fill: new Fill({
              color: "#fff",
            }),
          }),
        });
        styleCache[size] = style;
      }
    }
    return style;
  }

  function getColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const loadMapData = () => {
    setLoading(true);
    fetch("/api/reports")
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setLoading(false);
        // props.setBody(data);
        let points = [];
        data?.forEach((item) => {
          points.push(
            new Feature({
              geometry: new Point([
                parseFloat(item.Longitude),
                parseFloat(item.Latitude),
              ]),
            })
          );
        });

        const source = new VectorSource({
          features: points,
        });

        setVector(source);

        const clusterSource = new Cluster({
          distance: parseInt(100, 10),
          minDistance: parseInt(0, 10),
          source: source,
        });

        const vector = new VectorSource({
          source: source,
        });

        reports.setSource(source);
        reports.setStyle(regularDataStyle);
        map.getView().fit(source.getExtent(), {
          padding: [100, 100, 100, 100],
        });
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  function regularDataStyle(feature) {
    const style = new Style({
      image: new CircleStyle({
        radius: 8,
        stroke: new Stroke({
          color: "#fff",
          width: 2,
        }),
        fill: new Fill({
          color: "#5BB318",
        }),
      }),
    });
    return style;
  }

  async function loadLayer(layername, color) {
    map.getLayers().forEach((layer) => {
      if (
        layer &&
        layer.get("title") !== "basemaps" &&
        layer.get("title") !== "landmarks"
      ) {
        map.removeLayer(layer);
      }
    });
    setLoading(true);
    legItems.push(layername);
    var wrd = await $.ajax({
      url: getUrl(layername),
      dataType: "json",
      success: {},
      error: function (xhr) {},
    });
    $.when(wrd).done(function (data) {
      let vLayer = new VectorLayer({
        title: layername,
      });

      const source = new VectorSource({
        features: new GeoJSON({}).readFeatures(data),
      });
      if (data?.features[0].geometry.type === "MultiPoint") {
        let f = [];
        data?.features?.forEach((item) => {
          f.push(
            new Feature({
              geometry: new Point([
                parseFloat(item?.geometry?.coordinates[0][0]),
                parseFloat(item?.geometry?.coordinates[0][1]),
              ]),
              // Name: item?.properties?.name,
              // AccountNo: item?.properties?.account,
              // MeterNo: item?.properties?.meterno,
              // CurrentBal: item?.properties?.currentbal,
              // ConnectionStatus: item?.properties?.connstatus,
              // Location: item?.properties?.location,
              // Material: item?.properties?.material,
            })
          );
        });
        const psource = new VectorSource({
          features: f,
        });
        setVector(psource);
        const clusterSource = new Cluster({
          distance: parseInt(50, 10),
          minDistance: parseInt(0, 10),
          source: psource,
        });
        // vLayer = new VectorLayer({
        //   source: clusterSource,
        // });
        vLayer.setSource(clusterSource);
        // vLayer = new VectorLayer();
        // vLayer.setSource(psource);
        vLayer.setStyle(function (feature) {
          const styleCache = {};
          let size = feature.values_.features.length;
          let style = styleCache[size];
          if (!style) {
            if (size === 1) {
              style = new Style({
                image: new CircleStyle({
                  radius: 10,
                  stroke: new Stroke({
                    color: "#fff",
                    width: 3,
                  }),
                  fill: new Fill({
                    color: color,
                  }),
                }),
              });
              styleCache[size] = style;
            } else {
              let r = Math.ceil(size / 5);
              if (r < 10) r = 10;
              else if (r > 40) r = 40;
              style = new Style({
                image: new CircleStyle({
                  radius: r,
                  stroke: new Stroke({
                    color: "#fff",
                    width: 3,
                  }),
                  fill: new Fill({
                    color: color,
                  }),
                }),
                text: new Text({
                  text: size.toString(),
                  fill: new Fill({
                    color: "#fff",
                  }),
                }),
              });
              styleCache[size] = style;
            }
          }
          return style;
        });

        setLoading(false);
      } else if (data?.features[0].geometry.type === "Point") {
        let f = [];
        data?.features?.forEach((item) => {
          f.push(
            new Feature({
              geometry: new Point([
                parseFloat(item?.geometry?.coordinates[0]),
                parseFloat(item?.geometry?.coordinates[1]),
              ]),
            })
          );
        });
        const psource = new VectorSource({
          features: f,
        });
        setVector(psource);
        const clusterSource = new Cluster({
          distance: parseInt(50, 10),
          minDistance: parseInt(0, 10),
          source: psource,
        });
        // vLayer = new VectorLayer({
        //   source: clusterSource,
        // });
        vLayer.setSource(clusterSource);
        // vLayer = new VectorLayer();
        // vLayer.setSource(psource);
        vLayer.setStyle(function (feature) {
          const styleCache = {};
          let size = feature.values_.features.length;
          let style = styleCache[size];
          if (!style) {
            if (size === 1) {
              style = new Style({
                image: new CircleStyle({
                  radius: 10,
                  stroke: new Stroke({
                    color: "#fff",
                    width: 3,
                  }),
                  fill: new Fill({
                    color: color,
                  }),
                }),
              });
              styleCache[size] = style;
            } else {
              let r = Math.ceil(size / 5);
              if (r < 10) r = 10;
              else if (r > 40) r = 40;
              style = new Style({
                image: new CircleStyle({
                  radius: r,
                  stroke: new Stroke({
                    color: "#fff",
                    width: 3,
                  }),
                  fill: new Fill({
                    color: color,
                  }),
                }),
                text: new Text({
                  text: size.toString(),
                  fill: new Fill({
                    color: "#fff",
                  }),
                }),
              });
              styleCache[size] = style;
            }
          }
          return style;
        });

        setLoading(false);
      } else {
        vLayer = new VectorLayer({
          title: layername,
          source: source,
          style: function (feature) {
            const style = new Style({
              fill: new Fill({
                color: color,
              }),
              stroke: new Stroke({
                color: getRandomColor(),
                width: 2,
              }),
            });

            legItemsStyles.push(style.stroke_["color_"]);
            return style;
          },
        });
      }
      setLegendItemsStyles(legItemsStyles);
      setLoading(false);
      map.addLayer(vLayer);
    });
  }

  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function olColor(cl, alpha) {
    var colorArray = asArray(cl).slice();
    colorArray[3] = alpha;
    return colorArray;
  }

  function getUrl(url) {
    return `/geoserver/${activeUrl}/wfs?request=GetFeature&version=1.0.0&typeName=${activeUrl}:${url}&outputFormat=json`;
  }

  return (
    <div className="maps">
      <div className="wrapper">
        <div
          ref={mapElement}
          style={{ width: "100%", height: "100%" }}
          id="map"
        ></div>

        <div className="analyses">
          <Analysis
            data={["Cluster", "Regular", "Heatmap"]}
            setAnalysis={setAnalysis}
            active={analysis}
          />
        </div>
        <Layers
          basemap={basemap}
          networks={networks}
          setBasemap={setBasemap}
          selected={selected}
          setSelected={setSelected}
          netSelected={netSelected}
          setNetSelected={setNetSelected}
          graticule={graticule}
          incidences={reports}
          utilities={reports}
          sewer={reports}
          setActiveUrl={setActiveUrl}
        />
        {loading && <RippleLoading />}
        {legendItems && <LegendGroup legendItems={legendItems} map={map} />}
      </div>
    </div>
  );
}

const LegendGroup = (props) => {
  return (
    <div className="networksLegend">
      {props.legendItems &&
        props.legendItems.map((item, i) => {
          return <LegendItem key={i} item={item} map={props.map} />;
        })}
    </div>
  );
};

const LegendItem = (props) => {
  const [showing, setShowing] = useState(true);

  useEffect(() => {
    if (props.map) {
      props.map.getLayers().forEach((layer) => {
        if (layer && layer.get("title") === props.item.name) {
          layer.setVisible(showing);
        }
      });
    }
  }, [showing]);

  return (
    <div style={{ marginBottom: "3px" }} className="cwrap">
      <input
        type="checkbox"
        checked={showing}
        onChange={(e) => {
          setShowing(e.target.checked);
        }}
      />
      <div
        style={{
          border: `2px solid yellow`,
          backgroundColor: props.item.color,
          height: "16px",
          width: "16px",
          borderRadius: "24px",
          fontSize: "x-large",
          textAlign: "center",
          lineHeight: "16px",
        }}
      ></div>
      <p>{props.item.name}</p>
    </div>
  );
};

const Layers = (props) => {
  const [display, setDisplay] = useState("none");
  return (
    <div
      className="layers"
      onMouseOut={() => {
        setDisplay("none");
      }}
      onMouseOver={() => {
        setDisplay("block");
      }}
    >
      <h3>
        Map Layers <i className="fa fa-angle-down"></i>
      </h3>
      <div className="container" style={{ display: display }}>
        <h4>Basemap</h4>
        <div className="basemaps">
          {myData.map((item, index) => {
            return (
              <Basemap
                key={index}
                index={index}
                label={item.name}
                layer={props.basemap}
                setLayer={props.setBasemap}
                url={item.url}
                selected={props.selected}
                setSelected={props.setSelected}
              />
            );
          })}
        </div>
        <h4>Networks</h4>
        <div className="basemaps">
          {props.networks.map((item, index) => {
            return (
              <Network
                key={index}
                index={index}
                label={item.name}
                layer={props.basemap}
                setLayer={props.setBasemap}
                url={item.url}
                netSelected={props.netSelected}
                setNetSelected={props.setNetSelected}
                setActiveUrl={props.setActiveUrl}
              />
            );
          })}
        </div>
        {/* <h4>Map Grid</h4>
        <Item label="Graticule" layer={props.graticule} checked={true} />
        <h4>Layers</h4>
        <Item label="Incidences" layer={props.incidences} checked={true} /> */}
      </div>
    </div>
  );
};
