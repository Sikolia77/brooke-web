import Button from "../../../Utils/ButtonMain";
import MyError from "../../../Utils/MyError";

const Item = (props) => {
  const removeLayer = () => {
    let d = props.body;
    d.data.url.splice(props.index, 1);
    props.updateBody(d);
  };

  const changePosition = (v) => {
    let newIndex = props.index + v;
    let d = props.body;
    d.data.url = movePos(d.data.url, props.index, newIndex);
    props.updateBody(d);
  };

  function movePos(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }

  return (
    <div className="ls">
      <i className="fa fa-map"></i>
      <label>
        {props.item.split(":")[0]} - {props.item.split(":")[1]}
      </label>
      <i
        onClick={() => {
          if (props.index !== props.body.data.url.length - 1) changePosition(1);
        }}
        className="fa fa-angle-down"
      ></i>
      <i
        onClick={() => {
          if (props.index !== 0) {
            changePosition(-1);
          }
        }}
        className="fa fa-angle-up"
      ></i>
      <i
        onClick={() => {
          removeLayer();
        }}
        className="fa fa-trash"
      ></i>
    </div>
  );
};

export default function ShowLayers(props) {
  return (
    <div className="lyrs">
      {props.body.data.url && props.body.data.url?.length > 0 ? (
        props.body.data.url.map((item, index) => {
          return (
            <Item
              key={index}
              item={item}
              index={index}
              body={props.body}
              updateBody={props.updateBody}
            />
          );
        })
      ) : (
        <MyError txt="Please add some layers!" />
      )}
      <Button label="Add Layer" handleClick={props.toggleShowing} />
    </div>
  );
}
