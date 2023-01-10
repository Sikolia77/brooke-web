import MyError from "../../../Utils/MyError";

const Item = (props) => {
  return (
    <div className="ls">
      <div
        className="prev"
        onClick={() => {
          props.openStyler(props.index);
        }}
        style={{
          backgroundColor: props.body.styles[props.index].fillColor,
          border: `1px solid ${props.body.styles[props.index].color}`,
        }}
      ></div>
      <label>{props.item.split(":")[1]}</label>
    </div>
  );
};

export default function Styles(props) {

 
  return (
    <div className="items">
      <h3>Map Layers</h3>
      <p>Style map layers.</p>

      <div className="styles">
        {props.body.data.url && props.body.data.url?.length > 0 ? (
          props.body.data.url.map((item, index) => {
            return (
              <Item
                key={index}
                item={item}
                index={index}
                body={props.body}
                updateBody={props.updateBody}
                openStyler={props.openStyler}
              />
            );
          })
        ) : (
          <MyError txt="Please add some layers!" />
        )}
      </div>
    </div>
  );
}
