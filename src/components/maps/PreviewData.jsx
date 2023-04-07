import ImageUpload from "./ImageUpload";

export default function PreviewData(props) {
  return (
    <div className="desc">
      <h2>{props.body.attributes.Title}</h2>
      <div className="description">
        <p>{props.body.attributes.Description}</p>
      </div>
    </div>
  );
}
