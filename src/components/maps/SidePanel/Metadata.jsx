import MyError from "../../Utils/MyError";

const Item = (props) => {
  return (
    <div className="it">
      <h5>{props.label}</h5>
      <h6>{props.txt}</h6>
    </div>
  );
};

export default function Metadata(props) {
  return (
    <div className="items">
      <h3>Metadata</h3>
      <p>Metadata of the {props.body.attributes.Title}</p>

      {props.body.attributes ? (
        <>
          <Item label="Name of Dataset" txt={props.body.attributes.Dataset} />
          <Item label="Theme" txt={props.body.attributes.Theme} />
          <Item label="Data Owner" txt={props.body.attributes.Owner} />
          <Item label="Keywords" txt={props.body.attributes.Kenywords} />
          <Item label="Default Classification" txt={props.body.style.classification} />
          <Item label="Default analysis column" txt={props.body.style.column} />
          <Item label="Data Type" txt={props.body.attributes.Type} />
        </>
      ) : (
        <MyError txt="Please load some data first!!!" />
      )}
    </div>
  );
}
