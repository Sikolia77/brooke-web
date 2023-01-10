import MyPie from "./Others/MyPie";
import Barchart from "./Others/MyBarChart";
import { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";

export default function Charts(props) {
  const [showBarChart, setShowBarChart] = useState(false);
    const [reload, setReload] = useState(false);
  const piechrt = useRef(null);
  const barchrt = useRef(null);

  useEffect(() => {
    if (piechrt.current) {
      htmlToImage
        .toPng(piechrt.current)
        .then(function (dataUrl) {
          props.setPChartImgUrl(dataUrl);
        })
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
        });
    }
    if (barchrt.current) {
      htmlToImage
        .toPng(barchrt.current)
        .then(function (dataUrl) {
          props.setBChartImgUrl(dataUrl);
        })
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
        });
    }
  }, [props.pChartImgUrl, props.bChartImgUrl, reload]);

  const pieChart = () => {
    setShowBarChart(false);
  };

  const barChart = () => {
    setShowBarChart(true);
  };

  return (
    <div className="items">
      <h3>Charts</h3>
      <p>
        Thematic Services facilitate the users to select, browse and query the
        Thematic Datasets from this portal.
      </p>
      <button
        onClick={() => {
          pieChart();
        }}
      >
        Piechart
      </button>
      <button
        onClick={() => {
          barChart();
        }}
      >
        Barchart
      </button>
      <br />
      <br />
      {!showBarChart && (
        <MyPie
          reload={reload}
          setReload={setReload}
          ref={piechrt}
          body={props.body}
        />
      )}
      {showBarChart && (
        <Barchart
          reload={reload}
          setReload={setReload}
          ref={barchrt}
          body={props.body}
        />
      )}
    </div>
  );
}
