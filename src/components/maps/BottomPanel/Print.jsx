import Button from "../../Utils/ButtonMain";
import { BlobProvider, PDFDownloadLink, PDFRenderer, PDFViewer } from "@react-pdf/renderer";
import SearchReport from "../../export/SearchReport";
import { useEffect, useState } from "react";
import FileSaver from "file-saver";


export default function Print(props) {
  
  const [blob, setBlob] = useState();

  useEffect (() => {
    printMap()
  }, [])

  const printMap = () => {
    let file;
    let format = "blob";
    let overridedPluginOptions = {
      mimeType: "image/jpeg",
    };
    props.simpleMapScreenshoter
      ?.takeScreen(format, overridedPluginOptions)
      .then((blob) => {
        setBlob(window.URL.createObjectURL(blob));
      })
      .catch((e) => {});
  };

  return (
    <div className="items">
      <div className="optns">
        <h3>Map Screenshot</h3>
        <p>Click the button below to export map instance as PDF.</p>

        <br />
        {props.body && (
          <BlobProvider
            document={
              <SearchReport
                body={props.body}
                blob={blob}
                pChartImgUrl={props.pChartImgUrl}
                bChartImgUrl={props.bChartImgUrl}
              />
            }
            fileName={props.body["attributes"].Title}
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                "Generating PDF..."
              ) : (
                <a href={url} target="_blank">
                  Open PDF in a new tab
                </a>
              )
            }
          </BlobProvider>
        )}
        <br />
        <br />

        {props.body && (
          <PDFDownloadLink
            document={
              <SearchReport
                body={props.body}
                pChartImgUrl={props.pChartImgUrl}
                blob={blob}
                bChartImgUrl={props.bChartImgUrl}
              />
            }
            fileName={props.body["attributes"].Title}
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                "Generating PDF..."
              ) : (
                <Button
                  handleClick={() => {
                    printMap();
                  }}
                  label="Download PDF"
                />
              )
            }
          </PDFDownloadLink>
        )}
        <br />

        <Button handleClick={props.printMap} label="Save" />
      </div>
    </div>
  ); 
}
