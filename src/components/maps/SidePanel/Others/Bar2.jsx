import stylingicon from "../../../../assets/imgs/styling.png";
export default function Bar(props) {
  const color = props.active === props.txt ? "#74465C" : "#030092";

  return (
    <div
      style={{ color: color }}
      onClick={() => {
        props.toggle(props.id);
      }}
    >
      <img src={props.icon} className="styleicons" alt="Image" />
    </div>
  );
}
