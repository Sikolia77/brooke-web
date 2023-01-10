export default function DataSection(props) {
  return (
    <div
      className="dataSection"
      onClick={() =>
        (window.location.href = `/admin/instances/${props.item.Category.split(
          " "
        )[0].toLowerCase()}/preview/${props.item.ID}`)
      }
    >
      <img src={props.item.Thumbnail} alt=""></img>
      <div className="description">
        <h3>{props.item.Title}</h3>
        <p>{props.item.Category}</p>
        <p>{props.item.Description}</p>
      </div>
    </div>
  );
}
