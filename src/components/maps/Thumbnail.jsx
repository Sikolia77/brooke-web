export default function Thumbnail(props) {
  
  return (
    <div
      onClick={() => {
        window.location.href = `/admin/instances/${props.item.Category.split(
          " "
        )[0].toLowerCase()}/preview/${props.item.ID}`;
      }}
      
      className="thumbnail"
    >
      <img src={props.item.Thumbnail} alt="" />
      <div className="desc">
        <h4>{props.item.Title}</h4>
        <p>{props.item.updatedAt.split("T")[0]}</p>
      </div>
    </div>
  );
}
