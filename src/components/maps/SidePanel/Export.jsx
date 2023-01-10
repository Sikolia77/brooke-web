import { useState } from "react";
import downloadImg from "../../../assets/imgs/download.png";
import MyError from "../../Utils/MyError";

const Item = (props) => {
  return (
    <div className="exp" onClick={() => props.handleClick(props.ext)}>
      <img src={downloadImg} alt="" />
      <p>{props.txt}</p>
    </div>
  );
};

export default function Export(props) {
  const [service, setService] = useState(null);
  const [body] = useState({
    Download: null,
    Address: null,
    Keywords: null,
    OtherInfo: null,
  })
  
  const downLoadData = (ext) => {
    let url =
      getUrl(props.body.data.url).slice(
        0,
        getUrl(props.body.data.url).length - 4
      ) + ext;
    fetch(url)
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = url;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); //afterwards we remove the element again
      })
      .then(() => {
        let d = body;
        d.Download = props.instance["attributes"]["Title"];
        //d.Address = props.instance["data"]["url"]
        d.Theme = props.instance["attributes"]["Theme"];
        d.Keywords = props.instance["attributes"]["Title"];
        d.GeoserverURL = props.instance["data"]["url"];
        d.Type = ext;
        d.DownloadID = props.instanceId;
        d.OtherInfo = `Owner ${props.instance["attributes"]["Owner"]}`;
        fetch("/api/downloads/create", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else throw Error("");
          })
          .then((data) => {})
          .catch((err) => {});
      })
      .catch((err) => {});

      
  };

  const wfsLink = () => {
    setService(getUrl(props.body.data.url));
  };


  function getUrl(url) {
    return `localhost:8080/geoserver/${
      url.split(":")[0]
    }/wfs?request=GetFeature&version=1.0.0&typeName=${url}&outputFormat=json`;
  }

  return (
    <div className="items">
      <h3>Export Dataset</h3>
      <p>Click on the download icon to download dataset</p>

      {props.body.data.url ? (
        <>
          <h5>Vector Data</h5>
          <Item
            ext="shape-zip"
            handleClick={downLoadData}
            txt="Esri Shapefiles (SHP)"
          />
          <Item
            ext="GML2"
            handleClick={downLoadData}
            txt="Geography Markup Language (GML)"
          />
          <Item
            ext="CSV"
            handleClick={downLoadData}
            txt="Comma Separated Values (CSV)"
          />
          <Item ext="json" handleClick={downLoadData} txt="GeoJSON" />

          <div className="div2equal">
            <div>
              <h5>Web Services</h5>
              <Item txt="WFS" handleClick={wfsLink} />
              <Item txt="WMS" handleClick={wfsLink} />
              {props.body.attributes.Type === "Raster" && (
                <Item txt="WCS" handleClick={wfsLink} />
              )}
              <Item txt="WMTS" handleClick={wfsLink} />
            </div>
            {/* <div>
              <h5>Raster Data</h5>
              <Item ext="Tiff" handleClick={downLoadImage} txt="GeoTiff" />
              <Item ext="PNG" handleClick={downLoadImage} txt="PNG" />
              <Item ext="JPEG" handleClick={downLoadImage} txt="JPEG" />
            </div> */}
          </div>
          {service && (
            <div className="link">
              <h4>Copy the link below</h4>
              <input type="text" value={service} />
            </div>
          )}
        </>
      ) : (
        <MyError txt="Please load some data first!!!" />
      )}
    </div>
  );
}
