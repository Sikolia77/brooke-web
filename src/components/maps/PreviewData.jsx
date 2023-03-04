import ImageUpload from "./ImageUpload";

export default function PreviewData(props) {
  return (
    <div className="desc">
      <h2>{props.body.attributes.Title}</h2>

      <div className="div2equal">
        <div>
          <div className="description">
            <p>{props.body.attributes.Description}</p>
          </div>

          <h4>
            <span>Dataset: </span>
            {props.body.attributes.Dataset}
          </h4>
    
        </div>
        <ImageUpload
          preview={true}
          body={props.body}
          updateBody={props.updateBody}
        />
      </div>
    </div>
  );
}
