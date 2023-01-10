import "../../Styles/PublicationsData.scss";

export default function PublicationsData(props) {
  let url = "http://localhost:3004" + props.item.File;
  return (
    <div className="dataSections">
      <h3 onClick={() => (window.location.href = "")}>{props.item.Title}</h3>
      <div className="publications">
        <p>Updated on: {props.item.Date.split("T")[0]} </p>
        <p>Publication Type: {props.item.Type}</p>
        <button onClick={() => {window.open(url, "_blank")}}>View/Download</button>
      </div>
    </div>
  );
}
