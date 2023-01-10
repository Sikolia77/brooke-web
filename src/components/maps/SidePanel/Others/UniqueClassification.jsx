import Classes from "./Classes";
import Item from "./Item";

export default function UniqueClassification(props) {

  return (
    <div className="list">
      <Item id={0} name={props.layer} />
      {props.body.style.classes?.length > 0 &&
        props.body.style.classes.map((item, index) => {
          return (
            <Classes
              key={index}
              body={props.body}
              updateBody={props.updateBody}
              item={item}
            />
          );
        })}
    </div>
  );
}
