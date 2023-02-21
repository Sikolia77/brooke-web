import { useRef } from "react";
import Button from "../Utils/ButtonMain";
import ImageUpload from "./ImageUpload";
import InputMap from "./InputMap";

export default function AttributeData(props) {
  const title = useRef();
  const description = useRef();
  const dataset = useRef();
  const keywords = useRef();

  const populateMeta = () => {
    let d = props.body;
    d.attributes.Title = title.current.value;
    d.attributes.Description = description.current.value;
    d.attributes.Dataset = dataset.current.value;
    props.updateBody(d);
    props.submitData();
  };

  return (
    <div className="cont">
      <div className="div2equal">
        <div>
          <InputMap
            ref={title}
            label="Map Title (max 50 words)"
            v="Title"
            style={{ color: "#74465C" }}
            value={props.body.attributes.Title}
          />
          <InputMap
            ref={description}
            v="Description"
            label="Description (max 300 words)"
            value={props.body.attributes.Description}
          />
          <InputMap
            ref={dataset}
            label="Name of the Dataset"
            value={props.body.attributes.Dataset}
            v="Dataset"
            style={{ fontSize: "12pt", color: "#74465C" }}
          />
           {/* <InputMap
            ref={keywords}
            label="Keywords"
            v="Keywords"
            value={props.body.attributes.Keywords}
            style={{ fontSize: "12pt", color: "#74465C" }}
          /> */}
          {/* <InputMap
            ref={owner}
            label="Owner"
            v="Owner"
            value={props.body.attributes.Owner}
            style={{ fontSize: "12pt", color: "#74465C" }}
          />  */}
        </div>
        <div className="divequal">
          <div className="thumb">
            <ImageUpload body={props.body} updateBody={props.updateBody} />
          </div>
          <Button handleClick={populateMeta} label="Create Map" />
        </div>
      </div>
    </div>
  );
}
